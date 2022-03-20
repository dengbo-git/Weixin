
Page({
  
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper'
    }
  },
  data: {
    swiper:{
    background: [
      'https://public.img.china1.fun/homework/p1.jpeg',
      'https://public.img.china1.fun/homework/p2.jpeg',
      'https://public.img.china1.fun/homework/p3.jpeg',
      'https://public.img.china1.fun/homework/p4.jpeg',
      'https://public.img.china1.fun/homework/p5.jpeg'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500
  },
  functionItems:[
  {
    functionName:'老照片修复',
    functionImg:"https://public.img.china1.fun/homework/p1.jpeg",
    functionRoute:'/pages/home/picture/oldRepair/oldRepair'
  },
  {
    functionName:'照片换底',
    functionImg:"https://public.img.china1.fun/homework/p2.jpeg",
    functionRoute:'/pages/home/picture/bgColorChange/bgColorChange'
  },
  {
    functionName:'模糊照片修复',
    functionImg:"https://public.img.china1.fun/homework/p2.jpeg",
    functionRoute:'/pages/home/picture/blurryRepair/blurryRepair'
  },
  {
    functionName:'开发中ing',
    functionImg:"https://public.img.china1.fun/homework/p4.jpeg",
    functionRoute:'/pages/home/picture/developIng/developIng'
  }
  ]
},
})
