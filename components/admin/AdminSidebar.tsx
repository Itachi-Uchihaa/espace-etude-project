import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_ROUTES } from '@/lib/adminroutes';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-[280px] h-[100vh] items-start justify-between p-[25.65px] bg-white border border-solid border-[#cccccc]">
      <div className="flex flex-col items-start gap-[25.65px] relative self-stretch w-full flex-[0_0_auto]">
        <img
          className="relative w-[138.5px] h-[55.23px]"
          alt="L space logo"
          src="https://c.animaapp.com/mal635r7GTUhfP/img/l-space-logo-removebg-preview-1.png"
        />
        <nav className="flex flex-col items-start gap-[15.39px] relative self-stretch w-full flex-[0_0_auto]">
          {ADMIN_ROUTES.map((route: any) => {
            return (<div className="flex flex-col w-[90%] items-center justify-center relative flex-[0_0_auto] mr-[-0.34px] bg-primary rounded-[10px]">
              <div onClick={()=> {router.push(route.path)}} className="justify-center gap-[20.52px] p-[15.39px] self-stretch w-full rounded-[5.13px] flex items-center relative flex-[0_0_auto]">
                {route.icon}
                
                <div className="flex-1 text-[#000000] relative mt-[-1.28px] [font-family:'Plus_Jakarta_Sans',Helvetica] font-medium text-[18px] tracking-[0] leading-[25.6px]">
                  {route.title}
                </div>
              </div>
            </div>)
          })}

          <div className="flex flex-col w-[90%] items-center justify-center relative flex-[0_0_auto] mr-[-0.34px]" />
        </nav>
      </div>

      <div className="flex flex-col items-start gap-[15.39px] relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-[15.39px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col w-[90%] items-center justify-center relative flex-[0_0_auto] mr-[-0.34px]">
            <div className="justify-center gap-[20.52px] p-[15.39px] self-stretch w-full rounded-[5.13px] flex items-center relative flex-[0_0_auto]">
              {/* <USignOutAlt className="!relative !w-[25.65px] !h-[25.65px]" /> */}
              <div className="flex-1 text-[#71839b] relative mt-[-1.28px] [font-family:'Plus_Jakarta_Sans',Helvetica] font-medium text-[20.5px] tracking-[0] leading-[25.6px]">
                Logout
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-[10.26px] p-[15.39px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative w-[51.3px] h-[51.3px]">
            <div className="w-[51px] h-[51px]">
              <div className="relative h-[51px] bg-white rounded-[8977.04px] overflow-hidden border-[1.28px] border-solid border-[#d9d9d9]">
                <img
                  className="absolute w-[51px] h-[51px] top-0 left-0 object-cover"
                  alt="Element"
                  src="https://c.animaapp.com/mal635r7GTUhfP/img/59.png"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-[5.13px] relative flex-1 grow">
            <div className="relative self-stretch mt-[-1.28px] font-normal text-primary-gray text-[15.4px] tracking-[0] leading-[20.5px] text-[#000000]">
              Jhon Doe
            </div>

            <div className="relative self-stretch font-normal text-secondary-gray text-[15.4px] tracking-[0] leading-[18.0px] text-[#000000]">
              jhondoe@gmail.com
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
} 