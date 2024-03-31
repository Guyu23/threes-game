import confetti from 'canvas-confetti'

// 每次移动后需要根据此 MAP 计算新的board状态
export const DIRECTION_MAP: {
    [key: string]: {
        i: number[]
        minus?: boolean
        reverse?: boolean
    }
} = {
    up: {
        i: [1, 4],
    },
    down: {
        i: [2, -1],
        minus: true,
    },
    left: {
        i: [1, 4],
        reverse: true,
    },
    right: {
        i: [2, -1],
        reverse: true,
        minus: true,
    },
}

// 每个方块的基础信息
export interface BlockType {
    [key: string]: any
    id?: string // 方块的唯一标识
    num: number // 方块显示的数字
    x: number
    y: number
    showUp: boolean // 是否显示动画
    max: boolean // 是否是最大的方块
    showScore: boolean // 是否显示分数
    zIndex: number
    slideIn?: string // 滑入的方向
}

export type BlockList = BlockType[] // 地图信息

export function CAN_COMBINE(num1: number, num2: number) {
    return (num1 === num2 && num1 > 2) || num1 + num2 === 3
}

// 键盘上下左右事件处理
export function handleKeyDown(
    event: KeyboardEvent,
    fn: (direction: string) => void,
) {
    switch (event.key) {
        case 'ArrowUp':
            fn('up')
            break
        case 'ArrowDown':
            fn('down')
            break
        case 'ArrowLeft':
            fn('left')
            break
        case 'ArrowRight':
            fn('right')
            break
        default:
            break
    }
}

/**
 * 生成方块的坐标
 * 第一个参数在遍历的时候指 应该沿着哪个方向依次判断，第二个参数指定方块移动过程中不变的方向
 * 第三个参数指定方块移动过程中变化的方向
 * 第四个参数用于指定生成方块坐标的最大值，此时第一个参数为固定坐标，第二个参数为变化坐标
 * example:
 * 向上移动的时候，应该从 [0, 1] -> [0, 2] -> [0, 3] 依次判断方块的合并和移动情况（最上面的无法移动，只能等待合并，所以无需判断）
 * 此时生成的方块应该在 [0, 3] -> [3, 3] 之间（即地图底部那一行）
 */
export const direction_map: {
    [key: string]: [string, string, number, number]
} = {
    up: ['y', 'x', -1, 3],
    down: ['y', 'x', 1, 0],
    left: ['x', 'y', -1, 3],
    right: ['x', 'y', 1, 0],
}

export function LoseGame(blockList: BlockList) {
    const wastBlock = new Set()
    let lose = true
    const directions = [
        { dx: 0, dy: -1 }, // top
        { dx: 1, dy: 0 }, // right
        { dx: 0, dy: 1 }, // bottom
        { dx: -1, dy: 0 }, // left
    ]
    for (let i = 0; i < 16; i++) {
        let block = blockList[i]
        for (const direction of directions) {
            let neighborBlock = blockList.find(
                (item) =>
                    item.x === block.x + direction.dx &&
                    item.y === block.y + direction.dy,
            )
            if (neighborBlock && !wastBlock.has(neighborBlock.id)) {
                if (CAN_COMBINE(block.num, neighborBlock.num)) {
                    lose = false
                    break
                } else {
                    wastBlock.add(block.id)
                }
            }
        }
    }
    return lose
}

export function celebrate() {
    var count = 200
    var defaults = {
        origin: { y: 0.8 },
        ticks: 200,
    }

    function fire(particleRatio: number, opts: any) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
        })
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    })
    fire(0.2, {
        spread: 60,
    })
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    })
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    })
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    })
}