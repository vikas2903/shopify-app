import React from 'react'


const CardItem = ({key,shop, title, image,description, url}) => {

   
  return (
    <div   style={{
      background: '#fff',
      borderRadius: '24px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      padding: '0',
      width: 'calc(100% - 40px)', 
      margin: '20px',
      fontFamily: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Image preview with favorite icon */}
      <div section_id={key} style={{
        width: '100%',
        height: '300px',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px',
        paddingBottom: '0px',
        overflow: 'hidden',
      }}>
        <img
          src={image}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
        />
        <button style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(255,255,255,0.8)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }} aria-label="Add to favorites">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>

      {/* Content */}
      <div style={{ width: '100%', padding: '15px 20px 30px 20px', boxSizing: 'border-box' }}>
        {/* FREE badge */}
        <span style={{
          display: 'inline-block',
          background: '#EAFBF2',
          color: '#3CB371',
          fontWeight: 500,
          fontSize: '13px',
          borderRadius: '8px',
          padding: '2px 12px',
          marginBottom: '8px',
        }}>
          FREE
        </span>

        {/* Title */}
        <div style={{ fontWeight: 600, fontSize: '1.4rem', margin: '18px 0 16px 0' }}>
         {title}
        </div>

        {/* Description */}
        <div style={{ color: '#444', fontSize: '1rem', marginBottom: '24px', minHeight: '40px' }}>
          Lorem ipsum dolor sit amet consectetur. Tortor bibendum in faucibus orci.
        </div>

        {/* Actions row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{
              background: '#F5F5F5',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginRight: '2px',
            }} aria-label="Info">
              <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </button>
            <button  onClick={()=>{ window.open(`${url}`, '_blank');}} style={{
              background: '#F5F5F5',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }} aria-label="Preview">
              <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <button onClick={() =>{window.open(`https://admin.shopify.com/store/${shop}/themes/`, '_blank')}} style={{
            background: '#1976F6',
            color: '#fff',
            border: 'none',
            borderRadius: '24px',
            fontWeight: 600,
            fontSize: '1.1rem',
            padding: '10px 38px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(25,118,246,0.08)',
            flexBasis: '50%'
          }}>
            Install
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardItem