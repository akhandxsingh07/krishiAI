import React, { useState } from 'react';
import { Search, BookOpen, Filter, AlertCircle, ShieldAlert, Sparkles, ChevronDown, ChevronUp, Droplets, Leaf } from 'lucide-react';
import { DiseaseDetail, Language } from '../types';
import { DISEASES_DATABASE } from '../data/diseasesData';
import { getTranslation } from '../locales/translations';

interface DiseaseEncyclopediaProps {
  currentLang: Language;
  onSelectDiseaseForScan?: (cropName: string) => void;
}

export const DiseaseEncyclopedia: React.FC<DiseaseEncyclopediaProps> = ({
  currentLang,
  onSelectDiseaseForScan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedPathogen, setSelectedPathogen] = useState('All');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(DISEASES_DATABASE[0].id);

  const t = (key: string) => getTranslation(currentLang, key);

  const cropOptions = ['All', 'Rice / Paddy', 'Wheat', 'Cotton', 'Tomato', 'Potato', 'Sugarcane', 'Maize / Corn'];
  const pathogenOptions = ['All', 'Fungal', 'Bacterial', 'Viral', 'Pest / Insect'];

  const filteredDiseases = DISEASES_DATABASE.filter((disease) => {
    const matchesSearch =
      disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (disease.localName[currentLang] && disease.localName[currentLang]?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      disease.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCrop = selectedCrop === 'All' || disease.crop.includes(selectedCrop.split('/')[0].trim());
    const matchesPathogen = selectedPathogen === 'All' || disease.pathogen.toLowerCase().includes(selectedPathogen.toLowerCase());

    return matchesSearch && matchesCrop && matchesPathogen;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a3b18a]/10 border border-[#a3b18a]/30 text-[#a3b18a] text-xs uppercase tracking-widest font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ICAR & Agronomic Knowledge Atlas</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-light text-[#f2f2e8] font-serif">
          {t('diseasesTitle')}
        </h2>
        <p className="text-sm sm:text-base text-[#f2f2e8]/70 max-w-3xl mx-auto font-light">
          {t('diseasesSubtitle')}
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-5 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 shadow-2xl space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#a3b18a] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs sm:text-sm text-[#f2f2e8] placeholder-[#f2f2e8]/30 focus:outline-none focus:border-[#a3b18a]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          {/* Crops */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[#f2f2e8]/40 uppercase tracking-widest text-[10px] font-semibold whitespace-nowrap">Crop:</span>
            {cropOptions.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3 py-1 rounded-lg text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                  selectedCrop === crop
                    ? 'bg-[#a3b18a] text-[#0a110a] font-bold shadow-sm'
                    : 'bg-[#0a110a] text-[#f2f2e8]/70 hover:bg-[#1a241a] border border-[#a3b18a]/20'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>

          {/* Pathogen */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[#f2f2e8]/40 uppercase tracking-widest text-[10px] font-semibold whitespace-nowrap">Pathogen:</span>
            {pathogenOptions.map((path) => (
              <button
                key={path}
                onClick={() => setSelectedPathogen(path)}
                className={`px-3 py-1 rounded-lg text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                  selectedPathogen === path
                    ? 'bg-[#a3b18a] text-[#0a110a] font-bold shadow-sm'
                    : 'bg-[#0a110a] text-[#f2f2e8]/70 hover:bg-[#1a241a] border border-[#a3b18a]/20'
                }`}
              >
                {path}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="space-y-4">
        {filteredDiseases.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#121b12] border border-[#a3b18a]/20 text-[#f2f2e8]/50">
            <p className="text-sm">No diseases found matching your search and filter criteria.</p>
          </div>
        ) : (
          filteredDiseases.map((disease) => {
            const isExpanded = expandedCardId === disease.id;
            const localizedName = disease.localName[currentLang] || disease.name;

            return (
              <div
                key={disease.id}
                id={`disease-card-${disease.id}`}
                className="rounded-xl bg-[#121b12] border border-[#a3b18a]/20 hover:border-[#a3b18a]/40 transition-all shadow-lg overflow-hidden"
              >
                {/* Collapsible Card Header */}
                <div
                  onClick={() => setExpandedCardId(isExpanded ? null : disease.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none hover:bg-[#a3b18a]/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={disease.imageUrl}
                      alt={disease.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover border border-[#a3b18a]/30 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#a3b18a]">{disease.crop}</span>
                        <span className="text-[#f2f2e8]/30">•</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#0a110a] text-[#a3b18a] border border-[#a3b18a]/30 uppercase tracking-wider font-semibold">
                          {disease.pathogen}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold ${
                          disease.severity === 'High'
                            ? 'bg-red-950/40 text-red-300 border border-red-500/30'
                            : 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                        }`}>
                          {disease.severity} Severity
                        </span>
                      </div>
                      <h3 className="text-lg font-light font-serif text-[#f2f2e8] flex items-center gap-2">
                        <span>{disease.name}</span>
                        {localizedName !== disease.name && (
                          <span className="text-sm font-sans font-normal text-[#a3b18a]">({localizedName})</span>
                        )}
                      </h3>
                      <p className="text-xs text-[#f2f2e8]/60 line-clamp-1 mt-0.5 font-light">
                        {disease.symptoms[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs text-[#a3b18a] font-semibold uppercase tracking-wider hidden sm:inline text-[11px]">
                      {isExpanded ? 'Hide Details' : 'View ICAR Remedies'}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 flex items-center justify-center text-[#a3b18a]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Card Details */}
                {isExpanded && (
                  <div className="p-6 pt-0 border-t border-[#a3b18a]/20 space-y-5 text-xs text-[#f2f2e8]/90">
                    {/* Symptoms and Favorable Factors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {/* Symptoms */}
                      <div className="p-4 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 space-y-2">
                        <h4 className="font-semibold text-[#a3b18a] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5 text-[#a3b18a]" />
                          <span>Identified Symptoms (लक्षण)</span>
                        </h4>
                        <ul className="space-y-1.5">
                          {disease.symptoms.map((sym, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[#f2f2e8]/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#a3b18a] mt-1 shrink-0" />
                              <span>{sym}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Causes / Favorable Weather */}
                      <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-600/20 space-y-2">
                        <h4 className="font-semibold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                          <Droplets className="w-3.5 h-3.5 text-amber-400" />
                          <span>Favorable Weather & Causes (कारण व मौसम)</span>
                        </h4>
                        <ul className="space-y-1.5 text-amber-100/90">
                          {disease.causes.map((cause, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                              <span>{cause}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 text-[11px] text-amber-300/80 font-medium">
                          <span className="font-semibold">Peak Risk Season: </span>
                          {disease.riskSeason}
                        </div>
                      </div>
                    </div>

                    {/* Chemical Control */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#a3b18a] uppercase tracking-wider text-[11px]">
                        Chemical Fungicides & Pesticides (अनुशंसित रासायनिक उपचार)
                      </h4>
                      <div className="overflow-x-auto rounded-lg border border-[#a3b18a]/20 bg-[#0a110a]">
                        <table className="w-full text-left">
                          <thead className="bg-[#141d14] text-[#a3b18a] font-semibold border-b border-[#a3b18a]/20 uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="p-2.5">Chemical Name</th>
                              <th className="p-2.5">Dosage / Litre</th>
                              <th className="p-2.5">Safety Period</th>
                              <th className="p-2.5">Instruction</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#a3b18a]/10 text-[#f2f2e8]/80">
                            {disease.chemicalTreatment.map((chem, idx) => (
                              <tr key={idx} className="hover:bg-[#a3b18a]/5">
                                <td className="p-2.5 font-medium text-[#f2f2e8]">{chem.name}</td>
                                <td className="p-2.5 text-[#a3b18a] font-mono font-medium">{chem.dosage}</td>
                                <td className="p-2.5 text-amber-300">{chem.safetyPeriodDays} days</td>
                                <td className="p-2.5 text-[#f2f2e8]/70">{chem.instruction}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Organic Alternatives */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#a3b18a] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-[#a3b18a]" />
                        <span>Organic & Bio-Control Measures (जैविक व प्राकृतिक उपाय)</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {disease.organicTreatment.map((org, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 space-y-1">
                            <p className="font-bold text-xs text-[#a3b18a]">{org.name}</p>
                            <p className="text-[#f2f2e8]/70 text-[11px]">
                              <span className="text-[#f2f2e8]/40 font-medium">Recipe: </span>
                              {org.recipe}
                            </p>
                            <p className="text-[#f2f2e8]/70 text-[11px]">
                              <span className="text-[#f2f2e8]/40 font-medium">Frequency: </span>
                              {org.frequency}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preventive Cultural Practices */}
                    <div className="p-3.5 rounded-lg bg-[#0a110a] border border-[#a3b18a]/20 space-y-1.5">
                      <h4 className="font-semibold text-[#a3b18a] uppercase tracking-wider text-[11px]">
                        Preventive Cultural Practices (रोकथाम के कृषि कार्य)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#f2f2e8]/70">
                        {disease.preventionTips.map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#a3b18a] font-bold">✓</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
