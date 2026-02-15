import type { FallbackProps } from "react-error-boundary";



const ErrorFallback = ({error,resetErrorBoundary}:FallbackProps)=>{
return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
      <p className="bg-red-500 text-white px-4 py-2 rounded  cursor-pointer" 
      onClick={resetErrorBoundary}>Try again.</p>  

    </div>
  );
}

export default ErrorFallback;