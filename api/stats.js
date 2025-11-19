export default async function handler(req, res) {
  const ADDRESS = "t1NosZVmmvKy4PSXEXLT15jEprc5YF3P8b6";
  const GOAL = 50;

  try {
    const r = await fetch(
      `https://api.zcha.in/v2/mainnet/accounts/${ADDRESS}?limit=200`
    );
    const data = await r.json();

    if (!data || !data.received_txs) {
      return res.status(200).json({
        total: 0,
        count: 0,
        avg: 0,
        progress: 0,
        txs: []
      });
    }

    const txs = data.received_txs.map(tx => ({
      txid: tx.hash,
      amount: tx.value / 1e8
    }));

    const total = txs.reduce((a, b) => a + b.amount, 0);
    const count = txs.length;
    const avg = count > 0 ? total / count : 0;
    const progress = Math.min(100, Math.round((total / GOAL) * 100));

    res.status(200).json({
      total,
      count,
      avg,
      progress,
      txs
    });

  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
}
