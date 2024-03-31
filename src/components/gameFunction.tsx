import '@/assets/css/gameFunction.css'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import History from './history'
export default function GameFunction({
  retryGame,
  gameStatus,
  historyList,
  randomBlock,
  score,
}: {
  retryGame: () => void
  historyList: number[]
  gameStatus: 'playing' | 'end'
  randomBlock: number
  score: number
}) {
  
  return (
    <>
      <div className="function flex justify-center items-center gap-20 text-white">
        <button
          type="button"
          className="retry bg-[#777E8C] h-12 w-24 ml-4 rounded text-2xl outline-none"
          onClick={retryGame}
        >
          Retry
        </button>
        <div className="nextBlock flex items-center justify-center bg-[#BBD9D9] rounded-lg w-[4.75rem] h-[6rem]">
          {randomBlock === 1 ? (
            <div
              key={uuid()}
              className="randomBlock randomBlock_1 rounded-xl w-[3.75rem] h-[4.5rem] bg-[#f16780]"
            ></div>
          ) : randomBlock === 2 ? (
            <div
              key={uuid()}
              className="randomBlock randomBlock_2 rounded-xl w-[3.75rem] h-[4.5rem] bg-[#72caf2]"
            ></div>
          ) : randomBlock >= 3 ? (
            <div
              key={uuid()}
              className="randomBlock randomBlock_3 rounded-xl w-[3.75rem] h-[4.5rem] bg-[white]"
            ></div>
          ) : null}
        </div>
        <History historyList={historyList} />
      </div>
      <GameScore gameStatus={gameStatus} score={score} />
    </>
  )
}


function GameScore({
  gameStatus,
  score,
}: {
  gameStatus: 'playing' | 'end'
  score: number
}) {
  return (
    <div
      className={
        'score text-yellow-400 text-6xl flex justify-center overflow-hidden ' +
        (gameStatus === 'end' ? 'scale-100 h-[4rem]' : 'scale-0 h-0')
      }
    >
      ✨{score}✨
    </div>
  )
  return null
}
