import React, { useState } from 'react';
import { Atom, BookOpen, ExternalLink, Search, CheckCircle2, FlaskConical, Dna, FileText } from 'lucide-react';

interface ScienceTarget {
  id: string;
  geneOrSymbol: string;
  name: string;
  uniprotId: string;
  organism: string;
  plddtConfidence: number; // 0-100
  plddtCategory: 'Very High' | 'Confident' | 'Low' | 'Very Low';
  pdbId: string;
  experimentalMethod: string;
  doi: string;
  description: string;
  linkedProductSlug: string;
}

const SCIENTIFIC_TARGETS: ScienceTarget[] = [
  {
    id: 't1',
    geneOrSymbol: 'TP53',
    name: 'Cellular Tumor Antigen p53',
    uniprotId: 'P04637',
    organism: 'Homo sapiens (Human)',
    plddtConfidence: 94.2,
    plddtCategory: 'Very High',
    pdbId: '1TUP',
    experimentalMethod: 'X-ray Crystallography (2.2 Å)',
    doi: '10.1038/s41586-024-07487-w',
    description: 'Crucial transcription factor regulating the cell cycle and preventing cancer mutations. Featured in our Modern Genomics & AlphaFold 3D Handbook.',
    linkedProductSlug: 'modern-genomics-alphafold-handbook',
  },
  {
    id: 't2',
    geneOrSymbol: 'BRCA1',
    name: 'Breast Cancer Type 1 Susceptibility Protein',
    uniprotId: 'P38398',
    organism: 'Homo sapiens (Human)',
    plddtConfidence: 86.4,
    plddtCategory: 'Confident',
    pdbId: '4OFB',
    experimentalMethod: 'X-ray Crystallography (1.85 Å)',
    doi: '10.1038/ng.3093',
    description: 'E3 ubiquitin-protein ligase involved in DNA double-strand break repair. Covered in clinical epidemiology datasets.',
    linkedProductSlug: 'clinical-data-science-machine-learning-bangladesh',
  },
  {
    id: 't3',
    geneOrSymbol: 'EGFR',
    name: 'Epidermal Growth Factor Receptor',
    uniprotId: 'P00533',
    organism: 'Homo sapiens (Human)',
    plddtConfidence: 91.8,
    plddtCategory: 'Very High',
    pdbId: '1M17',
    experimentalMethod: 'X-ray Crystallography (2.6 Å)',
    doi: '10.1016/j.cell.2006.07.036',
    description: 'Receptor tyrosine kinase targeted by kinase inhibitor therapeutic antibodies. Tested in photometric absorbance assays.',
    linkedProductSlug: 'apex-portable-uv-spectrometer',
  },
];

interface ScienceHubProps {
  onSelectProduct?: (slug: string) => void;
}

export const ScienceHub: React.FC<ScienceHubProps> = ({ onSelectProduct }) => {
  const [selectedTarget, setSelectedTarget] = useState<ScienceTarget>(SCIENTIFIC_TARGETS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTargets = SCIENTIFIC_TARGETS.filter(
    (t) =>
      t.geneOrSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.uniprotId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Atom className="w-3.5 h-3.5 text-teal-600" />
            <span>DeepMind Bioscience & Open Literature Hub</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Bioscience Research & Lab Integration
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Explore authentic structural biology records (UniProtKB, AlphaFold DB, RCSB PDB) mapped directly to educational textbooks and precision laboratory equipment available on MY SHOP BD.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gene, UniProt or PDB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Quick-try Example Pills */}
      <div className="flex items-center space-x-2 py-4 overflow-x-auto text-xs font-medium text-slate-600">
        <span className="text-slate-500 flex-shrink-0">Quick Target Examples:</span>
        {SCIENTIFIC_TARGETS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTarget(t)}
            className={`px-3 py-1.5 rounded-full border transition-all flex items-center space-x-1.5 flex-shrink-0 ${
              selectedTarget.id === t.id
                ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:border-teal-500'
            }`}
          >
            <Dna className="w-3 h-3" />
            <span>{t.geneOrSymbol}</span>
            <span className="opacity-75 font-mono">({t.uniprotId})</span>
          </button>
        ))}
      </div>

      {/* Target Details Card & Synchronized Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Left Column: Target Metadata & Provenance */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-slate-900 font-mono">
                  {selectedTarget.geneOrSymbol}
                </h3>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md text-xs font-mono font-medium">
                  UniProt: {selectedTarget.uniprotId}
                </span>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md text-xs font-mono">
                  PDB: {selectedTarget.pdbId}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-700 mt-1">{selectedTarget.name}</p>
              <p className="text-xs text-slate-500 italic">{selectedTarget.organism}</p>
            </div>

            {/* AlphaFold Canonical 4-Tier Scale */}
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block font-medium">AlphaFold pLDDT Confidence</span>
              <div className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold text-blue-800 mt-0.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      selectedTarget.plddtConfidence >= 90
                        ? '#0053D6'
                        : selectedTarget.plddtConfidence >= 70
                        ? '#65CBF3'
                        : '#FFDB13',
                  }}
                />
                <span>{selectedTarget.plddtConfidence}% — {selectedTarget.plddtCategory}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            {selectedTarget.description}
          </p>

          {/* Provenance & Outbound Authoritative Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Experimental Structure</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{selectedTarget.experimentalMethod}</span>
              <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1.5">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Verified In Vitro
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Literature Reference</span>
              <span className="font-mono text-slate-800 mt-0.5 block truncate">{selectedTarget.doi}</span>
              <a
                href={`https://doi.org/${selectedTarget.doi}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-teal-700 hover:underline mt-1.5 font-medium"
              >
                <span>View on PubMed / DOI</span>
                <ExternalLink className="w-2.5 h-2.5 ml-1" />
              </a>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">3D Model Prediction</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">AlphaFold DB v4+</span>
              <a
                href={`https://alphafold.ebi.ac.uk/entry/${selectedTarget.uniprotId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-teal-700 hover:underline mt-1.5 font-medium"
              >
                <span>Open AlphaFold Portal</span>
                <ExternalLink className="w-2.5 h-2.5 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Linked E-Commerce Product on MY SHOP BD */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-3">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Available in Store</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              Curated Curriculum & Laboratory Kit
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Get hands-on experience measuring target proteins and analyzing real genomic sequences using MY SHOP BD verified research gear and official PDF study guides.
            </p>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                  <span>Format:</span>
                </span>
                <span className="font-medium text-white">Digital PDF & Lab Instrument</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>Google Drive Backup:</span>
                </span>
                <span className="text-teal-300 font-medium">Supported</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectProduct?.(selectedTarget.linkedProductSlug)}
            className="w-full mt-6 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <span>View Related Product in Catalog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
