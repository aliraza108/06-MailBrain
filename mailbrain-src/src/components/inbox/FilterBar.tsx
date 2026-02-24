import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface InboxFilters {
  priority: string;
  intent: string;
  status: string;
  search: string;
}

const intentOptions = [
  "support_request",
  "refund_demand",
  "sales_inquiry",
  "meeting_request",
  "complaint",
  "spam",
  "urgent_escalation",
  "billing_question",
  "partnership_offer",
  "general_inquiry",
];

interface FilterBarProps {
  filters: InboxFilters;
  onChange: (filters: InboxFilters) => void;
}

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      <Select
        value={filters.priority}
        onValueChange={(value) => onChange({ ...filters, priority: value })}
      >
        <SelectTrigger className="w-full md:w-44 bg-card border-border">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Priorities</SelectItem>
          <SelectItem value="CRITICAL">CRITICAL</SelectItem>
          <SelectItem value="HIGH">HIGH</SelectItem>
          <SelectItem value="NORMAL">NORMAL</SelectItem>
          <SelectItem value="LOW">LOW</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.intent} onValueChange={(value) => onChange({ ...filters, intent: value })}>
        <SelectTrigger className="w-full md:w-48 bg-card border-border">
          <SelectValue placeholder="Intent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Intents</SelectItem>
          {intentOptions.map((intent) => (
            <SelectItem key={intent} value={intent}>
              {intent.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(value) => onChange({ ...filters, status: value })}>
        <SelectTrigger className="w-full md:w-40 bg-card border-border">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Status</SelectItem>
          <SelectItem value="processed">Processed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="error">Error</SelectItem>
        </SelectContent>
      </Select>

      <Input
        className="w-full md:flex-1 bg-card border-border"
        placeholder="Search sender or subject..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
    </div>
  );
};

export default FilterBar;

