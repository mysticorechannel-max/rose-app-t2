import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DesignSystemPage() {
  return (
    <main className="p-8">
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
      </div>
    </main>
  );
}