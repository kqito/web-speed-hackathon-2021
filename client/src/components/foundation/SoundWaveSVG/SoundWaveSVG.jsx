import map from 'lodash-es/map';
import chunk from 'lodash-es/chunk';
import calcMax from 'lodash-es/max';
import zip from 'lodash-es/zip';
import mean from 'lodash-es/mean';
import React from 'react';

/**
 * @typedef {object} Props
 * @property {ArrayBuffer} soundData
 */

/**
 * @type {React.VFC<Props>}
 */
const SoundWaveSVG = ({ soundData }) => {
  const uniqueIdRef = React.useRef(Math.random().toString(16));
  const [{ max, peaks }, setPeaks] = React.useState({ max: 0, peaks: [] });

  React.useEffect(async () => {
    const AudioContext = await import('standardized-audio-context').then(({ AudioContext }) => AudioContext);
    const audioCtx = new AudioContext();

    // 音声をデコードする
    /** @type {AudioBuffer} */
    const buffer = await new Promise((resolve, reject) => {
      audioCtx.decodeAudioData(soundData.slice(0), resolve, reject);
    });
    // 左の音声データの絶対値を取る
    const leftData = map(buffer.getChannelData(0), Math.abs);
    // 右の音声データの絶対値を取る
    const rightData = map(buffer.getChannelData(1), Math.abs);

    // 左右の音声データの平均を取る
    const normalized = map(zip(leftData, rightData), mean);
    // 100 個の chunk に分ける
    const chunks = chunk(normalized, Math.ceil(normalized.length / 100));
    // chunk ごとに平均を取る
    const peaks = map(chunks, mean);
    // chunk の平均の中から最大値を取る
    const max = calcMax(peaks);

    setPeaks({ max, peaks });
  }, [soundData]);

  return (
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
      {peaks.map((peak, idx) => {
        const ratio = peak / max;
        return (
          <rect
            key={`${uniqueIdRef.current}#${idx}`}
            fill="#2563EB"
            height={ratio}
            stroke="#EFF6FF"
            strokeWidth="0.01"
            width="1"
            x={idx}
            y={1 - ratio}
          />
        );
      })}
    </svg>
  );
};

export { SoundWaveSVG };
