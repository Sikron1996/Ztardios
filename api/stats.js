export const config = {
  runtime: "edge",
};

export default async function handler() {
  const ADDRESS = "t1NosZVmmvKy4PSXEXLT15jEprc5YF3P8b6";
  const GOAL = 50;

  try {
    // 1. Отримуємо транзакції адреси
    const r = await fetch(
      `https://api.zcha.in/v2/mainnet/transactions/${ADDRESS}?limit=200`,
      { cache: "no-cache" }
    );
    const raw = await r.json();

    // 2. Нормалізуємо відгук: масив або object
    const txs = Array.isArray(raw)
      ? raw
      : raw.txs
      ? raw.txs
      : [];

    // 3. Фільтруємо тільки ВХІДНІ (value > 0)
    const incoming = txs
      .filter(tx => typeof tx.value === "number" && tx.value > 0)
      .map(tx => ({
        txid: tx.hash,
        amount: tx.value / 1e8,
        time: tx.time || null
      }));

    // 4. Розрахунок
    const total = incoming.reduce((a, b) => a + b.amount, 0);
    const count = incoming.length;
    const avg = count > 0 ? total / count : 0;
    const progress = Math.min(100, Math.round((total / GOAL) * 100));

    // 5. Відповідь
    return new Response(
      JSON.stringify({
        total,
        count,
        avg,
        progress,
        txs: incoming,
      }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.toString() }),
      { status: 500 }
    );
  }
}
