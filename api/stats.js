export const config = {
  runtime: "edge",
};

export default async function handler() {
  const ADDRESS = "t1NosZVmmvKy4PSXEXLT15jEprc5YF3P8b6";
  const GOAL = 50;

  try {
    const r = await fetch(`https://api.zcha.in/v2/mainnet/accounts/${ADDRESS}`);
    const data = await r.json();

    if (!data || !data.txs) {
      return new Response(JSON.stringify({
        total: 0,
        count: 0,
        avg: 0,
        progress: 0,
        txs: []
      }), { status: 200 });
    }

    // Витягуємо тільки ВХІДНІ транзакції
    const incoming = data.txs.filter(tx => tx.value > 0)
      .map(tx => ({
        txid: tx.hash,
        amount: tx.value / 1e8
      }));

    const total = incoming.reduce((a, b) => a + b.amount, 0);
    const count = incoming.length;
    const avg = count > 0 ? total / count : 0;
    const progress = Math.min(100, Math.round((total / GOAL) * 100));

    return new Response(JSON.stringify({
      total,
      count,
      avg,
      progress,
      txs: incoming
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
}
