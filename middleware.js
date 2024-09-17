import { NextResponse } from "next/server";
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const defaultLocal="en"
const locales=["en","bn"]


function getLocale(request){
    const acceptedLanguage=request.headers.get("accept-language") ?? undefined;
    const headers={'accept-language':acceptedLanguage};
    const languages=new Negotiator({headers}).languages();
    return match(languages,locales,defaultLocal)
}

export function middleware(request){
    // get the pathName from request URL
    const pathName=request.nextUrl.pathname;
    const pathNameIsMissingLocal=locales.every(
        (locale)=>(
        !pathName.startsWith(`/${locale}`) && !pathName.startsWith(`${locale}/`)
    ))

    if(pathNameIsMissingLocal){
        // detect user preference and redirect with a local with a path
       const locale=getLocale(request)
       return NextResponse.redirect(new URL(`/${locale}/${pathName}`,request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next).*)"],
};