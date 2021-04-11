import React from 'react'
import { useRouter } from 'next/router'

const prevArrow = () => {
  const router = useRouter()
  return (
    <div>
      <div
        className={'leftArrow'}
        sx={{ mr: 2 }}
        onClick={router.back}
      />
      <style jsx>{`
        .leftArrow {
          position: relative;
          background: url("/leftArrayCTA.svg") no-repeat;
          width: 30px;
          height: 30px;
          background-size: contain;
          transition: transform 0.2s ease;
          cursor: pointer;
        }

        .leftArrow::after {
          position: absolute;
          content: "";
          display: inline-block;
          background: url("/ArrayCTA__dash--black.svg") no-repeat;
          background-size: contain;
          width: 25px;
          height: 25px;
          left: 8px;
          opacity: 0;
          top: calc(50% - 3px);
          transition: opacity 0.1s ease;
        }

        .leftArrow:hover {
          transform: translateX(-10px)
        }

        .leftArrow:hover::after {
          opacity: 1
        }
      `}</style>
    </div>
  )
}

export default prevArrow
