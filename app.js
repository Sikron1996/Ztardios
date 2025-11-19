
function nowTime(){
 const d=new Date();
 return d.toLocaleTimeString('uk-UA',{hour12:false});
}

async function loadStats(){
 try{
   const r=await fetch('/api/stats');
   const d=await r.json();

   document.getElementById('total').textContent=d.total.toFixed(4)+' ZEC';
   document.getElementById('txcount').textContent=d.count;
   document.getElementById('avg').textContent=d.avg.toFixed(4)+' ZEC';
   document.getElementById('mints').textContent=d.count;
   document.getElementById('updated').textContent=nowTime();
   document.getElementById('progress').textContent=d.progress+'%';
   document.getElementById('bar').style.width=d.progress+'%';

   const tx=document.getElementById('tx');
   tx.innerHTML='';
   d.txs.forEach(t=>{
     const div=document.createElement('div');
     div.className='txitem';
     div.textContent=t.txid.substring(0,12)+'...  +'+t.amount+' ZEC';
     tx.appendChild(div);
   });

 }catch(e){
   console.log(e);
 }
}
setInterval(loadStats,4000);
window.onload=loadStats;
