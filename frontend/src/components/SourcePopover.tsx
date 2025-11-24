import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";

interface Source {
  url: string;
  title: string;
}

interface SourcePopoverProps {
  sources: Source[];
}

export function SourcePopover({ sources }: SourcePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Show Sources
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Sources</h4>
            <p className="text-sm text-muted-foreground">
              The following sources were used to generate this content.
            </p>
          </div>
          <div className="grid gap-2">
            {sources.map((source, index) => (
              <div className="grid grid-cols-[1fr_auto] items-center gap-4" key={index}>
                <div className="truncate">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium leading-none text-blue-500 hover:underline"
                  >
                    {source.title}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}