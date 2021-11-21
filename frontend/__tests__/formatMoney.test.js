import formatMoney from '../lib/money';

describe('format money function', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('€0.01');
    expect(formatMoney(10)).toEqual('€0.10');
    expect(formatMoney(9)).toEqual('€0.09');
    expect(formatMoney(40)).toEqual('€0.40');
  });

  it('leaves off cents when its a whole euro', () => {
    expect(formatMoney(5000)).toEqual('€50');
    expect(formatMoney(100)).toEqual('€1');
    expect(formatMoney(50000000)).toEqual('€500,000');
  });

  it('works with fractional and whole euros', () => {
    expect(formatMoney(140)).toEqual('€1.40');
    expect(formatMoney(5012)).toEqual('€50.12');
    expect(formatMoney(110)).toEqual('€1.10');
    expect(formatMoney(101)).toEqual('€1.01');
    expect(formatMoney(54634562345234)).toEqual('€546,345,623,452.34');
  });
});
