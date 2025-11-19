import fetch from 'node-fetch';

const ADDRESS="t1NosZVmmvKy4PSXEXLT15jEprc5YF3P8b6";
const GOAL=50;

export default async function handler(req,res){
 try{
   const r = await fetch(`https://api.blockchair.com/zcash/dashboards/address/${ADDRESS}`);
   const j = await r.json();
   const data=j.data[ADDRESS];
   const txs=data.transactions.slice(0,50).map(t=>({
     txid:t.transaction_hash,
     amount: t.value/1e8
   }));
   const total = txs.reduce((a,b)=>a+b.amount,0);
   const progress = Math.min(100, Math.round((total/GOAL)*100));
   res.json({total,progress,txs});
 }catch(e){
   res.json({error:e.toString()});
 }
}
