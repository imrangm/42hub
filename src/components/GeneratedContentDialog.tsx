
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface GeneratedContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | null;
  isLoading: boolean;
}

export default function GeneratedContentDialog({ isOpen, onClose, title, content, isLoading }: GeneratedContentDialogProps) {
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    if (content) {
      navigator.clipboard.writeText(content)
        .then(() => {
          toast({ title: "Copied to clipboard!" });
        })
        .catch(err => {
          toast({ title: "Failed to copy", description: "Could not copy content to clipboard.", variant: "destructive" });
          console.error('Failed to copy: ', err);
        });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            AI-generated content. Review and edit as needed before use.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4 my-4 bg-muted/50">
          {isLoading ? (
            <p className="text-muted-foreground">Generating content...</p>
          ) : content ? (
            <pre className="text-sm whitespace-pre-wrap">{content}</pre>
          ) : (
            <p className="text-destructive">No content generated or an error occurred.</p>
          )}
        </ScrollArea>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          {!isLoading && content && (
             <Button type="button" onClick={handleCopyToClipboard}>
              Copy to Clipboard
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
