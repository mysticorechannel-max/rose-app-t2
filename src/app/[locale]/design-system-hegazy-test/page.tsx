"use client";

import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
const options = [
  { value: "eg", label: "Egypt" },
  { value: "sa", label: "Saudi Arabia" },
  { value: "ae", label: "UAE" },
  { value: "kw", label: "Kuwait" },
  { value: "jo", label: "Jordan" },
];
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
export default function DesignSystemPage() {

  const [country, setCountry] = useState("");
  return (
    <div className="p-8">
      <div className="w-[280px] space-y-2">
        <label className="text-sm font-medium">Label</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Selected Option</SelectItem>
            <SelectItem value="2">Option</SelectItem>
            <SelectItem value="3">Option</SelectItem>
          </SelectContent>
        </Select>

        <Combobox
          options={options}
          value={country}
          onValueChange={setCountry}
        />
        
      </div>
       <div className="w-[280px] space-y-2">
        <label className="text-sm font-medium">Menu</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => console.log("Option 1")}>
              Option
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Option 2")}>
              Option
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Option 3")}>
              Option
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}