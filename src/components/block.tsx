'use client'
import '@/assets/css/block.css'
import styled from 'styled-components'

const StyleBlock = styled.div<{
  $blocknum: number
  max: string
  x: number
  y: number
  $zindex: number
}>`
  color: ${(props) =>
    props.max === 'true' && props.$blocknum > 3
      ? '#FF607D'
      : props.$blocknum > 2
      ? 'black'
      : 'white'};
  background-color: ${(props) =>
    props.$blocknum > 2
      ? 'white'
      : props.$blocknum > 1
      ? '#72caf2'
      : '#f16780'};
  box-shadow: 0 0.5rem 0
    ${(props) =>
      props.$blocknum > 2
        ? '#ffcc68'
        : props.$blocknum > 1
        ? '#6ba6da'
        : '#cd537c'};
  top: ${(props) => `calc(1rem + ${props.y} * (600px - 1rem) / 4)`};
  left: ${(props) => `calc(1rem + ${props.x} * (450px - 1rem) / 4)`};
  z-index: ${(props) => props.$zindex};
`

export default function Block({
  blockNum,
  x,
  y,
  showScore,
  showUp,
  max,
    zIndex,
  slideIn
}: {
  blockNum: number
  x: number
  y: number
  showScore: boolean
  showUp: boolean
  max: boolean
        zIndex: number
  slideIn: string | undefined
}) {
  return (
    <StyleBlock
      $blocknum={blockNum}
      x={x}
      y={y}
      max={String(max)}
      $zindex={zIndex}
      className={`styleBlock flex z-10 absolute items-center justify-center font-light text-5xl ${
        showUp ? 'showUp' : ''
      }${slideIn ? `slide-${slideIn}` : ''}`}
    >
      {blockNum}
      {showScore && blockNum > 3 && (
        <div className="blockScore text-3xl text-[#F9C546] absolute top-[-0.75rem] left-[50%]">
          +{Math.pow(3, Math.log2(blockNum / 3))}
        </div>
      )}
    </StyleBlock>
  )
}
