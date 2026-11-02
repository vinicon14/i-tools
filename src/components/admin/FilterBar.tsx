// Global filter component for admin panel
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { type GlobalFilters, type DatePreset, formatDatePreset } from '@/lib/admin-filters';
import { tools } from '@/lib/catalog';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: GlobalFilters;
  onChange: (filters: GlobalFilters) => void;
  availableCountries?: string[];
  availableTrafficSources?: string[];
}

export function FilterBar({ filters, onChange, availableCountries = [], availableTrafficSources = [] }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

  const datePresets: DatePreset[] = [
    'today',
    'yesterday',
    'last7days',
    'last30days',
    'last90days',
    'thisMonth',
    'previousMonth',
    'custom',
  ];

  const handlePresetChange = (preset: DatePreset) => {
    onChange({
      ...filters,
      datePreset: preset,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      onChange({
        ...filters,
        datePreset: 'custom',
        startDate: customStartDate.toISOString().split('T')[0],
        endDate: customEndDate.toISOString().split('T')[0],
      });
    }
  };

  const handleClearFilters = () => {
    onChange({
      datePreset: 'last30days',
      startDate: undefined,
      endDate: undefined,
      toolSlug: undefined,
      country: undefined,
      deviceType: undefined,
      trafficSource: undefined,
    });
    setCustomStartDate(undefined);
    setCustomEndDate(undefined);
  };

  const hasActiveFilters = filters.toolSlug || filters.country || filters.deviceType || filters.trafficSource;

  return (
    <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-white">Filtros</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-slate-400 hover:text-white"
          >
            {showAdvanced ? 'Ocultar' : 'Avançado'}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs text-slate-400 hover:text-white"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Date Preset */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-slate-400">Período</Label>
          <Select value={filters.datePreset} onValueChange={(value) => handlePresetChange(value as DatePreset)}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {datePresets.map((preset) => (
                <SelectItem key={preset} value={preset}>
                  {formatDatePreset(preset)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range */}
        {filters.datePreset === 'custom' && (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-slate-700/50 border-slate-600 text-white',
                      !customStartDate && 'text-slate-400'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customStartDate ? customStartDate.toLocaleDateString('pt-BR') : 'Selecione'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={setCustomStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-slate-700/50 border-slate-600 text-white',
                      !customEndDate && 'text-slate-400'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customEndDate ? customEndDate.toLocaleDateString('pt-BR') : 'Selecione'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={setCustomEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleCustomDateApply}
                disabled={!customStartDate || !customEndDate}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Aplicar
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
          {/* Tool Filter */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-400">Ferramenta</Label>
            <Select
              value={filters.toolSlug || 'all'}
              onValueChange={(value) => onChange({ ...filters, toolSlug: value === 'all' ? undefined : value })}
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {tools.map((tool) => (
                  <SelectItem key={tool.slug} value={tool.slug}>
                    {tool.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Country Filter */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-400">País</Label>
            <Select
              value={filters.country || 'all'}
              onValueChange={(value) => onChange({ ...filters, country: value === 'all' ? undefined : value })}
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {availableCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Device Filter */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-400">Dispositivo</Label>
            <Select
              value={filters.deviceType || 'all'}
              onValueChange={(value) =>
                onChange({ ...filters, deviceType: value === 'all' ? undefined : (value as any) })
              }
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Traffic Source Filter */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-400">Origem do Tráfego</Label>
            <Select
              value={filters.trafficSource || 'all'}
              onValueChange={(value) => onChange({ ...filters, trafficSource: value === 'all' ? undefined : value })}
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="direct">Direto</SelectItem>
                {availableTrafficSources.slice(0, 20).map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
