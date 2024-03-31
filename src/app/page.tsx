'use client'
import Block from '@/components/block'
import { useState, useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import {
  DIRECTION_MAP,
  CAN_COMBINE,
  BlockList,
  handleKeyDown,
  direction_map,
  LoseGame,
  celebrate,
} from '@/util/constants'
import GameFunction from '@/components/gameFunction'
import Footer from '@/components/footer'

// 不要和数组做强绑定，应该是自由的块儿
// 没有二维数组，直接就是块儿

export default function Home() {
  // 地图
  const board = Array.from({ length: 4 }, () => Array.from({ length: 4 }))
  // 方块
  const [blockList, setBlockList] = useState<BlockList>([])
  /**
   * 生成方块
   */
  const optionalBlock = useRef([1, 2, 3])
  const blockListRef = useRef<BlockList>(blockList)
  let gameStatus = useRef<'playing' | 'end'>('playing')
  let maxBlock = useRef(6)
  let historyList = useRef<number[]>([0, 0, 0])
  let score = useRef(0)
  let randomBlock = useRef<number>(0)

  function startGame() {
    const newBlockList = []
      const coordinateSet = new Set()
      maxBlock.current = 6
    gameStatus.current = 'playing'
    for (let i = 0; i < 6; i++) {
      const length = optionalBlock.current.length
      let newBlock

      do {
        let x = Math.floor(Math.random() * 4)
        let y = Math.floor(Math.random() * 4)
        newBlock = {
          num: optionalBlock.current[Math.floor(Math.random() * length)],
          id: uuid(),
          x,
          y,
          max: false,
          showUp: true,
          showScore: false,
          zIndex: 1,
        }
      } while (coordinateSet.has(`${newBlock.x},${newBlock.y}`))

      coordinateSet.add(`${newBlock.x},${newBlock.y}`)
      newBlockList.push(newBlock)
    }
    randomBlock.current =
      optionalBlock.current[
        Math.floor(Math.random() * optionalBlock.current.length)
      ]
    setBlockList(newBlockList)
  }

  function generateRandomPosition(direction: string, blockList: BlockList) {
    const d = direction_map[direction]
    const move_prop = d[1] as 'x' | 'y'
    const static_prop = d[3]
    const positionList = Array.from({ length: 4 }, (_, i) => {
      return move_prop === 'x' ? [i, static_prop] : [static_prop, i]
    }).filter(
      (item) =>
        !blockList.some((block) => block.x === item[0] && block.y === item[1]),
    )
    return positionList[Math.floor(Math.random() * positionList.length)]
  }

  function handleMove(e: KeyboardEvent) {
    e.stopPropagation()
    e.preventDefault()
    handleKeyDown(e, moveBlock)
  }

  function moveBlock(direction: string) {
    // 做法一：遍历整个地图
    const d = DIRECTION_MAP[direction]
    let hasMoved = false
    let x = d.i[0]
    const blockList = [...blockListRef.current]
    blockList.forEach((block) => (block.slideIn = ''))
    const x_limite = d.i[1]
    const minus = d.minus
    const reverse = d.reverse
    for (; minus ? x > x_limite : x < x_limite; x += minus ? -1 : 1) {
      for (let y = 0; y < 4; y++) {
        const currentX = reverse ? x : y
        const currentY = reverse ? y : x
        const nextX = reverse ? currentX + (minus ? 1 : -1) : currentX
        const nextY = reverse ? currentY : currentY + (minus ? 1 : -1)
        const block = blockList.find(
          (block) => block.x === currentX && block.y === currentY,
        )
        if (!block) {
          continue
        }
        block.max = false
        const nextBlock = blockList.find(
          (block) => block.x === nextX && block.y === nextY,
        )
        if (nextBlock) {
          if (CAN_COMBINE(block.num, nextBlock.num)) {
            block.id = uuid()
            block.num += nextBlock.num
            block.x = nextX
            block.y = nextY
            block.showUp = true
            block.zIndex = 2
            blockList.splice(blockList.indexOf(nextBlock), 1)
            nextBlock.zIndex = 1
            hasMoved = true
          }
        } else if (nextX >= 0 && nextX < 4 && nextY >= 0 && nextY < 4) {
          hasMoved = true
          block.x = nextX
          block.y = nextY
        }
        if (block.num >= maxBlock.current) {
          maxBlock.current = block.num
          block.max = true
        }
      }
    }
    // 没有移动过说明此方向无法移动
    if (!hasMoved) return
    const newBlock = generateRandomPosition(direction, blockList)
    blockList.push({
      num: randomBlock.current,
      id: uuid(),
      x: newBlock[0],
      y: newBlock[1],
      showUp: false,
      showScore: false,
      max: false,
      zIndex: 1,
      slideIn: direction,
    })
    setBlockList(blockList)
    randomBlock.current =
      optionalBlock.current[
        Math.floor(Math.random() * optionalBlock.current.length)
      ]
  }

  function showResult() {
    const endList = [...blockListRef.current]
    endList.forEach((block) => {
      block.showScore = true
    })
    celebrate()
    setBlockList(endList)
  }

  useEffect(() => {
    startGame()
  }, [])

  useEffect(() => {
    window.removeEventListener('keyup', handleMove)
    window.addEventListener('keydown', handleMove)
  }, [])

  useEffect(() => {
    blockListRef.current = blockList
    if (
      blockListRef.current.length === 16 &&
      gameStatus.current === 'playing'
    ) {
      if (LoseGame(blockListRef.current)) {
        score.current = blockListRef.current.reduce(
          (prev, current) =>
            prev +
            (current.num > 3
              ? Math.pow(3, Math.log2(current.num / 3))
              : current.num),
          0,
        )
        gameStatus.current = 'end'
        let minHistory:number | undefined = historyList.current.find(
          (item) => item === 0
        )
          if (!minHistory) { 
            minHistory = Math.min(...historyList.current)
          }
        if (minHistory || minHistory === 0) {
          historyList.current[historyList.current.indexOf(minHistory)] =
            score.current
        }

        showResult()
      }
    }
  }, [blockList])

  return (
    <main className="flex flex-col gap-6 relative">
      <div className="title text-center text-4xl">
        <span className="text-[#72CAF2]">T</span>
        <span className="text-[#E46179] text-3xl">h</span>
        <span className="titleText text-2xl">rees!</span>
      </div>
      <div className="note absolute left-28 top-20 w-[300px] rounded-lg border p-4">
        Threes is a puzzle video game like 2048.
        <br />
        <br />
        use ⬆️ ⬇️ ⬅️ ➡️ to move combine numbered tiles.
        <br />
        <br />
        The combined rule is:
        <br />
        <br />
        <div className="shadow-lg text-white bg-[#F16780] w-4 h-6 rounded inline-block text-center">
          1
        </div>{' '}
        ➕{' '}
        <div className=" text-white shadow-lg bg-[#72CAF2] w-4 h-6 rounded inline-block text-center">
          2
        </div>{' '}
        🟰{' '}
        <div className="text-black bg-white shadow-lg w-4 h-6 rounded inline-block text-center">
          3
        </div>
        <br />
        <br />
        <div className="text-black bg-white shadow-lg w-4 h-6 rounded inline-block text-center">
          3
        </div>{' '}
        ➕{' '}
        <div className="text-black bg-white shadow-lg w-4 h-6 rounded inline-block text-center">
          3
        </div>{' '}
        🟰{' '}
        <div className="text-black bg-white shadow-lg w-4 h-6 rounded inline-block text-center">
          6
        </div>
        <br />
        <br />
        <div className="text-black bg-white shadow-lg w-4 h-6 rounded inline-block text-center">
          6{' '}
        </div>{' '}
        ➕{' '}
        <div className="text-black bg-white shadow-lg w-4 h-6 rounded inline-block text-center">
          6
        </div>{' '}
        🟰{' '}
        <div className="text-black bg-white shadow-lg w-6 h-6 rounded inline-block text-center">
          12
        </div>
        <br />
        <br />
        and so on...
      </div>
      <GameFunction
        retryGame={startGame}
        historyList={historyList.current}
        gameStatus={gameStatus.current}
        score={score.current}
        randomBlock={randomBlock.current}
      />
      <div className="content flex flex-col items-center justify-center">
        <div className="info"></div>
        <div className="board overflow-hidden w-[450px] h-[600px] bg-[#cfe7e0] rounded-xl flex flex-col p-3 gap-2 relative">
          {board.map((row, i) => (
            <div key={i} className="board-shadow flex-1 flex gap-2">
              {row.map((_, j) => (
                <div
                  key={j}
                  className="shadow-item flex-1 bg-[#BBD9D9] rounded-xl"
                />
              ))}
            </div>
          ))}
          {blockList.map((block) => (
            <Block
              key={block.id}
              blockNum={block.num}
              showUp={block.showUp}
              showScore={block.showScore}
              x={block.x}
              y={block.y}
              max={block.max}
              zIndex={block.zIndex}
              slideIn={block.slideIn}
            />
          ))}
        </div>
      </div>
      {/* <Footer /> */}
    </main>
  )
}
