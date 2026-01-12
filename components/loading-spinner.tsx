import { Spinner } from "@/components/ui/spinner"

interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Spinner className="w-8 h-8 text-bronze" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  )
}
