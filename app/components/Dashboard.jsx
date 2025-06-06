import React from 'react'
// import '../assets/style/tailwind.css'
import { Link } from "@remix-run/react";
function Dashboard() {
  return (
    <>
        <div className="relative flex size-full min-h-screen flex-col bg-[#f8fbfc] group/design-root overflow-x-hidden" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
            
            <div className="px-20 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                    <p className="text-[#0d181b] tracking-light text-[32px] font-bold leading-tight">Welcome to Ds App</p>
                    <p className="text-[#4c899a] text-sm font-normal leading-normal">Get started by creating your first UI extension or exploring the library.</p>
                </div>
                </div>
                <div className="flex justify-stretch">
                <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">

<Link to="/app/explore">
                    <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#13bceb] text-[#0d181b] text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                          <Link to="/app/explore">
                    <span className="truncate">Explore Section</span>
                    </Link>
                    </button>
</Link>
<Link to="/app/explore">
                    <button 
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e7f1f3] text-[#0d181b] text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                    <span className="truncate">Explore Blocks</span>
                    </button>
                    </Link>
                </div>
                </div>
                <h2 className="text-[#0d181b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">App Summary</h2>
                <div className="flex flex-wrap gap-4 p-4">
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#e7f1f3]">
                    <p className="text-[#0d181b] text-base font-medium leading-normal">Total Blocks Installed</p>
                    <p className="text-[#0d181b] tracking-light text-2xl font-bold leading-tight">09</p>
                </div>
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#e7f1f3]">
                    <p className="text-[#0d181b] text-base font-medium leading-normal">Active Stores</p>
                    <p className="text-[#0d181b] tracking-light text-2xl font-bold leading-tight">03</p>
                </div>
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#e7f1f3]">
                    <p className="text-[#0d181b] text-base font-medium leading-normal">Average Blocks per Store</p>
                    <p className="text-[#0d181b] tracking-light text-2xl font-bold leading-tight">04</p>
                </div>
                </div>
                <h2 className="text-[#0d181b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Usage Metrics</h2>
                <div className="flex flex-wrap gap-4 px-4 py-6">
                <div className="flex min-w-72 flex-1 flex-col gap-2">
                    <p className="text-[#0d181b] text-base font-medium leading-normal">Daily Block Usage</p>
                    <p className="text-[#0d181b] tracking-light text-[32px] font-bold leading-tight truncate">+15%</p>
                    <div className="flex gap-1">
                    <p className="text-[#4c899a] text-base font-normal leading-normal">Last 7 Days</p>
                    <p className="text-[#078834] text-base font-medium leading-normal">+15%</p>
                    </div>
                    <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                    <svg width="100%" height="148" viewBox="-3 0 478 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path
                        d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                        fill="url(#paint0_linear_1131_5935)"
                        ></path>
                        <path
                        d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                        stroke="#4c899a"
                        stroke-width="3"
                        stroke-linecap="round"
                        ></path>
                        <defs>
                        <linearGradient id="paint0_linear_1131_5935" x1="236" y1="1" x2="236" y2="149" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#e7f1f3"></stop>
                            <stop offset="1" stop-color="#e7f1f3" stop-opacity="0"></stop>
                        </linearGradient>
                        </defs>
                    </svg>
                    <div className="flex justify-around">
                        <p className="text-[#4c899a] text-[13px] font-bold leading-normal tracking-[0.015em]">Mon</p>
                        <p className="text-[#4c899a] text-[13px] font-bold leading-normal tracking-[0.015em]">Tue</p>
                        <p className="text-[#4c899a] text-[13px] font-bold leading-normal tracking-[0.015em]">Wed</p>
                        <p className="text-[#4c899a] text-[13px] font-bold leading-normal tracking-[0.015em]">Thu</p>
                        <p className="text-[#4c899a] text-[13px] font-bold leading-normal tracking-[0.015em]">Fri</p>
                        <p className="text-[#4c899a] text-[13px] font-bold leading-normal tracking-[0.015em]">Sat</p>
                        <p className="text-[#4c899a] text-[13px] font-bold leading-normal tracking-[0.015em]">Sun</p>
                    </div>
                    </div>
                </div>
                </div>
                <h2 className="text-[#0d181b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Extensions Library</h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                <div className="flex flex-col gap-3 pb-3">
                    <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPUIy-xWkJyFQHEkann5P3_jFNfyyNpS27jRrutyPoAL-32zBRA6GPCgT5sbpvFXw5CzMAxrp06Vzu54ZnnGsBVHzK0uOtSqgmxwfaX5uB1YjEnXJXi5Huyz1qru5kfGJJsk5OxdYNjsPgJhxEx9rxYUYPE7qMEC54yUFVcHCWD069IgH-tOZOk7jtA_iwNktgNTwsRMTNq5FcOmok5uoF_nSxQIMiqGTaXnvyn4XK6jqlG8InH5eyDOSnU2JkRQPhZaIRqgQ1JKg");'
             }}       ></div>
                    <div>
                    <p className="text-[#0d181b] text-base font-medium leading-normal">Product Display Block</p>
                    <p className="text-[#4c899a] text-sm font-normal leading-normal">Showcase products with dynamic content</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                    <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCmUy8cFLzz7I3_-k0NDtdKJ1XHYpHNlBgRlXg6a62qVN4a5Nj6IE5hhtNDs2zSsGqwpPJOccZZOckzhOkrSOqC2l1UJUdCgquTfnbX8KgAj7aFU8T8KVOK9nFv2t8_chEgBULSP35MxaXjQquuprDFMEEi2OdaZzVCbVBjA_yc7wzRQPvXurgfDK6jhrLML4U4hY9mMhTNZ5Rg20dT4KgcyOhpCJzF_x9iss1mxUtHCfOouZGciEP-YbHrsjijIWwWeiMH9shmJbs");'
                 }}   ></div>
                    <div>
                    <p className="text-[#0d181b] text-base font-medium leading-normal">Checkout Promotion Block</p>
                    <p className="text-[#4c899a] text-sm font-normal leading-normal">Offer promotions during checkout</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                    <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCn7KOgKwWCmmIYLr9P9XFhRIPe3qa7d4TTlpUsVh3vIa3CWNlRe-jYyZkYcux6SuykHTQYHhXlWlL4IILF0jbupSuEMt-uiy2oqI7gn6yoFP4_elBZpqyOo_PFZFlijgzxdUnZUUj3U01aYjkuvaKgDxCSEgg9vz6QQbjE2UTp4uhvMVuXwSPCAL7vEEKkYIjSzZuruPg5JZR1ZJavWhllQ_iOtXeEeGHxwmCQQQNrUFjK76k9plslrKTyxXaKAPE7OL9IH_-wRfU")'}}></div>
                    <div>
                    <p className="text-[#0d181b] text-base font-medium leading-normal">Order Confirmation Block</p>
                    <p className="text-[#4c899a] text-sm font-normal leading-normal">Enhance order confirmation page</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                    <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBKBU-1zuFAyAlh0hROMr4Y6nnqgKoNxI0bSkV6BNzCr09JWmh6RrJeyzKDGizN8211zo0VBcYlfOxmPqV3DarcUrmGH0JwTUmzS5MdMZJAPNFlKqHXJMjR1Css3CHqzSldGdqgTADfdP5J21WM-KU6pxMOquOUY3Tr5V_deFxgxpPc5N8XDYuStQ-fwr5XBoJeMamXPPi9pZklLV9Hvwkev4wFlUTX7E-khEmgo-5pDtC3RUGNHnEUhX-H0Lju1149ia0MR08qzt4");'
                    }}></div>
                    <div>
                    <p className="text-[#0d181b] text-base font-medium leading-normal">Customer Account Block</p>
                    <p className="text-[#4c899a] text-sm font-normal leading-normal">Customize customer account details</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                    <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBb8lWmWlkbg-UprDaJrQA1Kr1SlNrVSZ7WFIJeD-uo4k0jdxFGBPVPGdRuHghvaqyCvu4DRmvOve3cvW6ZSfyZiXVkKySmxugKOQWkruiNHs_9Gupj_hrDIbsmwMRSfE5I8spRY7niZPpzd5IaIL0EqjYTrdTtVT2wHrt1vbVUixT84LfLRfZt2HwrRZMj-Flh-O1gIdtrDZnOgf2F5XrhmxiZkJ2I_fPDycGUCebfTrO44Utqx3_1lwvQVA1e-tW-t4pBtcppA3E");'
                   }} ></div>
                    <div>
                    <p className="text-[#0d181b] text-base font-medium leading-normal">Cart Summary Block</p>
                    <p className="text-[#4c899a] text-sm font-normal leading-normal">Improve cart summary information</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                    <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQCYgZb8K6QLXBbGRNlAfuQvXlTVOUGrwOQZGPwCHv-gdPR9eUJoD45ful1cXkg8lnnUTeE_o-6eK4QUKmkkTrXNkUO3k5OyE91EbenOr-h0qi37WGumgCx2dKiGinwUEVoUmihrIozcAw1ZEO-n2Mp32Or1Ft3f0cGMr6_IW_zOh_2FPosnla2i2K4PJV8TNit7Yt8qDov3kh6gU08acpuWgUehg1h3M7tWBI6ARgxDMl0O6sOK1r8VjH0t6RGCOd-dcCHETzZ8s");'
                   } }></div>
                    <div>
                    <p className="text-[#0d181b] text-base font-medium leading-normal">Footer Announcement Block</p>
                    <p className="text-[#4c899a] text-sm font-normal leading-normal">Add announcements to the footer</p>
                    </div>
                </div>
                </div>
                <div className="flex items-center justify-center p-4">
                <a href="#" className="flex size-10 items-center justify-center">
                    <div className="text-[#0d181b]" data-icon="CaretLeft" data-size="18px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                    </svg>
                    </div>
                </a>
                <a className="text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-[#0d181b] rounded-full bg-[#e7f1f3]" href="#">1</a>
                <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#0d181b] rounded-full" href="#">2</a>
                <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#0d181b] rounded-full" href="#">3</a>
                <a href="#" className="flex size-10 items-center justify-center">
                    <div className="text-[#0d181b]" data-icon="CaretRight" data-size="18px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                    </svg>
                    </div>
                </a>
                </div>
                <h2 className="text-[#0d181b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Support &amp; Help</h2>
                <p className="text-[#0d181b] text-base font-normal leading-normal pb-3 pt-1 px-4">Need assistance? Check out our documentation or contact us directly.</p>
                <div className="flex justify-stretch">
                <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                    <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e7f1f3] text-[#0d181b] text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                    <span className="truncate">Documentation</span>
                    </button>
                    <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e7f1f3] text-[#0d181b] text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                    <span className="truncate">Contact Support</span>
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </>
  )
}

export default Dashboard