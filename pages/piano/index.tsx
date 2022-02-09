import React, { useEffect } from 'react';
import Select from 'react-select';
import useMIDI from '../../hooks/useMIDI';
import { instrumentName } from '../../lib/piano/instrumentName';

const PianoPage = () => {
  const { midi, midiInput, midiOutput, loading, pressedKeys, error, onChangeInstrument } = useMIDI();

  // useEffect(() => {
  //   if (player) {
  //     console.log({ player });
  //   }
  // }, [player]);

  return (
    <div>
      <h1>{midi ? 'MIDI Ready' : 'MIDI Not Ready'}</h1>
      <div>{loading && <div>loading...</div>}</div>
      <div>
        {Array.from(pressedKeys).map((key) => (
          <div key={key}>{key}</div>
        ))}
        {error && <div>{error}</div>}
      </div>
      <Select options={instrumentName} onChange={onChangeInstrument} />
      {/* <select onChange={onChangeInstrument} value={selectedValue}>
        {Object.keys(instrumentName).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select> */}
    </div>
  );
};

export default PianoPage;