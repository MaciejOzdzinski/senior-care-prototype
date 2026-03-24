import { allSpecializations } from "@/data/mock-data";
import { FilterChip } from "@/components/ui/filter-chip";

interface FilterBarProps {
  activeFilters: Set<string>;
  onToggle: (id: string) => void;
  className?: string;
}

export function FilterBar({
  activeFilters,
  onToggle,
  className,
}: FilterBarProps) {
  return (
    <div className={className}>
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {allSpecializations.map((tag) => (
          <FilterChip
            key={tag.id}
            label={tag.label}
            active={activeFilters.has(tag.id)}
            onClick={() => onToggle(tag.id)}
          />
        ))}
      </div>
    </div>
  );
}
