// Meta Pixel tracking utilities

// Initialize Meta Pixel
export const initializeMetaPixel = () => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    return true; // Already initialized
  }
  
  try {
    // Create script element
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '2406747486323295');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
    
    // Create noscript element
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = 'https://www.facebook.com/tr?id=2406747486323295&ev=PageView&noscript=1';
    noscript.appendChild(img);
    document.head.appendChild(noscript);
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Meta Pixel:', error);
    return false;
  }
};

// Track page view
export const trackPageView = () => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'PageView');
  }
};

// Track conversion event
export const trackConversion = (eventName: string, data: any = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, data);
    
    // Also send to Conversion API
    sendConversionAPI(eventName, data);
  }
};

// Send event to Conversion API
export const sendConversionAPI = async (eventName: string, data: any = {}) => {
  try {
    const apiData = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: {
          client_ip_address: '{{client_ip_address}}',
          client_user_agent: navigator.userAgent
        },
        custom_data: {
          ...data
        }
      }],
      access_token: 'EAAG9A5px4gMBOZC9Dzoca4bGAvSOSVI0gVZCxTjYPJfsPhQApTcPldJaLxE3q2dzgXw0fzs7UmZBFWj5HD4YfKfO5QnX6BVfxS6wRZCcZBcGMN4BsXzqXQTwYe53519apNj0OWi1IIa6eY5zqKamSymenEROmFMTvQ0JDXrPidOJpSs8tZBRn5ZCZADfZChrtUlc6sAZDZD'
    };
    
    const response = await fetch('https://graph.facebook.com/v17.0/2406747486323295/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData)
    });
    
    const result = await response.json();
    console.log('Conversion API response:', result);
    return result;
  } catch (error) {
    console.error('Error sending to Conversion API:', error);
    return null;
  }
};

// Track purchase event
export const trackPurchase = (value: number, currency: string = 'USD', contentName: string, contentId: string) => {
  trackConversion('Purchase', {
    value,
    currency,
    content_name: contentName,
    content_ids: [contentId],
    content_type: 'product'
  });
};

// Track lead event
export const trackLead = (value: number = 0, currency: string = 'USD', contentName: string) => {
  trackConversion('Lead', {
    value,
    currency,
    content_name: contentName
  });
};

// Track checkout initiation
export const trackInitiateCheckout = (value: number, currency: string = 'USD', contentName: string, contentId: string) => {
  trackConversion('InitiateCheckout', {
    value,
    currency,
    content_name: contentName,
    content_ids: [contentId],
    content_type: 'product'
  });
};

// Track add to cart
export const trackAddToCart = (value: number, currency: string = 'USD', contentName: string, contentId: string) => {
  trackConversion('AddToCart', {
    value,
    currency,
    content_name: contentName,
    content_ids: [contentId],
    content_type: 'product'
  });
};

export default {
  initializeMetaPixel,
  trackPageView,
  trackConversion,
  trackPurchase,
  trackLead,
  trackInitiateCheckout,
  trackAddToCart
};