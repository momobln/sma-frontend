"use client";     // Tells Next.js this runs(browser).&localStorage and useEffect i client,

import { useEffect } from "react";  // React hook to run code after page renders.(عند الظهور في الشاشة)

import { useRouter } from "next/navigation"; // Next.js router hook to navigate programmatically between pages.


export default function HomePage() { //homepage component (shown when visiting "/").

  const router = useRouter();   // router object redirect users (to /login || /shifts).


  useEffect(() => {     //callback function
    const token = localStorage.getItem("token");//chick token from localStorage if exist.
    if (token) router.push("/shifts"); 
    else router.push("/login");
  }, [router]); //عمليًا، هذا الفحص يحدث مرة واحدة فقط عند تحميل الصفحة. 
//dependency array safe but unchanged
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  );
}
