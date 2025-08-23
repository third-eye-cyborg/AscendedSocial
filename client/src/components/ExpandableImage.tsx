import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExpandableImageProps {
  src: string;
  alt: string;
  className?: string;
  children: React.ReactNode;
  title?: string;
}

export default function ExpandableImage({ src, alt, className, children, title }: ExpandableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={`cursor-pointer hover:opacity-80 transition-opacity ${className || ''}`}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-slate-900 border border-slate-700">
        <div className="space-y-4">
          {title && (
            <h3 className="text-xl font-semibold text-white text-center">{title}</h3>
          )}
          <div className="flex justify-center">
            <img 
              src={src}
              alt={alt}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
              data-testid="expanded-image"
            />
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="bg-transparent border-primary/50 text-white hover:bg-primary/20"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}