import React, { useState, useEffect, useRef } from 'react';
const BLUE="#2354F4",AMBER="#D97706",TEAL="#0891B2",VIOLET="#7C3AED",GREEN="#059669";


function FAQItem({q,a}){
  const [open,setOpen]=useState(false);
  return(
    <div style={{borderBottom:"1px solid rgba(255,255,255,.05)",padding:"1rem 0"}}>
      <button onClick={()=>setOpen(!open)} style={{background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem",fontFamily:"'DM Sans',sans-serif"}}>
        <span style={{fontSize:".92rem",fontWeight:600,color:"#CBD5E1"}}>{q}</span>
        <span style={{color:"#475569",fontSize:"1.1rem",transition:"transform .2s",transform:open?"rotate(45deg)":"rotate(0deg)",flexShrink:0}}>+</span>
      </button>
      {open&&<p style={{fontSize:".85rem",color:"#64748B",lineHeight:1.7,marginTop:".7rem",paddingRight:"2rem",animation:"fadeUp .2s ease"}}>{a}</p>}
    </div>
  );
}
export default FAQItem;
