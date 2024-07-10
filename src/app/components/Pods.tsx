"use client"

import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type PodsProps = {
  pods: string[];
  selectedPod: string | null;
  setSelectedPod: (podName: string) => void;
};

export const Pods = ({ pods = [], selectedPod, setSelectedPod }: PodsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value?.length && selectedPod !== value) {
      setSelectedPod(value);
    }
  }, [value, selectedPod, setSelectedPod]);

  if (!pods?.length) return <p>Loading pods...</p>;

  const podList = pods.map((pod) => ({ label: pod, value: pod }));

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label="Select Pod"
          variant="outline"
          role="combobox"
          className="w-[300px] justify-between"
          aria-expanded={isOpen}
        >
          {value ? podList.find((pod) => pod?.value === value)?.label : podList[0]?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search for pod..." />
          <CommandEmpty>No pods found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {podList.map((pod) => {
                return (
                  <CommandItem
                    key={pod.value}
                    value={pod.value}
                    onSelect={(currentValue: string) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setIsOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === pod.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {pod.label}
                  </CommandItem>
                )
              })}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
};
