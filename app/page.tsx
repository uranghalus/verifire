
import { cn } from "@/lib/utils";
import Image from "next/image";
import Logo from "./assets/logo";
import SigninForm from "@/components/auth/sign-in-form";

export default function Home() {
  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <Logo className='me-2' />
            <h1 className='text-xl font-medium'>Shadcn Admin</h1>
          </div>
        </div>
        <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-2'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-lg font-semibold tracking-tight'>Sign in</h2>
            <p className='text-muted-foreground text-sm'>
              Masukkan email dan kata sandi Anda di bawah ini <br /> untuk masuk ke akun Anda
            </p>
          </div>

          <SigninForm />
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Dengan mengklik masuk, Anda menyetujui{' '}
            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Ketentuan Layanan
            </a>{' '}
            dan{' '}
            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4 font-bold'
            >
              Kebijakan Privasi
            </a>
            .
          </p>
        </div>
      </div>

      <div
        className={cn(
          'bg-muted relative h-full overflow-hidden max-lg:hidden',
          '[&>img]:absolute [&>img]:top-[15%] [&>img]:left-20 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:object-top-left [&>img]:select-none'
        )}
      >
        <Image
          src={'/images/undraw_dialog-box_4p2h.svg'}
          width={1024}
          height={1151}
          alt='Shadcn-Admin'
        />

      </div>
    </div>
  );
}
