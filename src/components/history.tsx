import { useState } from 'react'
import { v4 as uuid } from 'uuid'

export default function History({ historyList }: { historyList: number[] }) {
  const [showHistory, setShowHistory] = useState(false)
  function toogleHistory() {
    setShowHistory(!showHistory)
  }
  return (
    <div className="relative">
      <button
        type="button"
        className="historyScore bg-[#777E8C] h-12 w-28 rounded text-2xl outline-none"
        onClick={toogleHistory}
      >
        History
      </button>
      <HistoryList showHistory={showHistory} historyList={historyList} />
    </div>
  )
}

function HistoryList({
  showHistory,
  historyList,
}: {
  showHistory: boolean
  historyList: number[]
}) {
  return (
    <div
      className={
        'historyList absolute overflow-hidden flex w-44 justify-center items-center flex-col gap-3 -right-48 top-0 rounded bg-[#BCF2FA] ' +
        (showHistory ? 'h-[12.5rem]' : 'h-0')
      }
    >
      {historyList
        .sort((a, b) => b - a)
        .map((score, index) => (
          <div
            key={uuid()}
            className="historyItem text-2xl bg-[#4BC61D] rounded w-36 h-12 text-center"
          >
            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
            {score === 0 ? '---' : score}
          </div>
        ))}
    </div>
  )
}
