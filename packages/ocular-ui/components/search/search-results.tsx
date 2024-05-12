import React, { useState } from 'react';
import Image from 'next/image';
import AppFilterOptions from "./app-filter-options";
import ReactMarkdown from 'react-markdown';
import {
  ChevronDownIcon,
} from "@heroicons/react/outline";

import { SearchCopilotSkeleton, SearchResultsSkeleton, SearchByAppFilterSkeleton } from '@/components/ui/skeletons';

// AI Results Component
export const AIResults = ({ content, search_results, isLoadingCopilot }) => {
  const [showResults, setShowResults] = useState(false);

  return (
    <>
      {isLoadingCopilot ? (
        <SearchCopilotSkeleton />
      ) : (
        <div className='flex flex-col rounded-3xl px-6 py-4 max-w-4xl space-y-3'>
          <div className='flex flex-row'>
            <div className="flex items-center space-x-2">
              <Image src="/Ocular-logo-light.svg" alt="Ocular Copilot" className="size-[50px]" width={50} height={10} /> 
              <h1 className='font-semibold text-l'>Copilot</h1>
            </div>
          </div>
          <ReactMarkdown className="font-regular text-md space-y-4">{content}</ReactMarkdown>
          <div className='mt-2 mb-3'>
            {search_results && search_results.length > 0 && (
              <button onClick={() => setShowResults(!showResults)}>
                <div className='flex flex-row bg-blue-100/50 dark:bg-muted border border-input p-2 px-3 rounded-2xl text-sm items-center gap-2'>
                  {search_results.length} sources
                  <ChevronDownIcon className={`h-4 ${showResults ? 'rotate-180' : ''}`} />
                </div>
              </button>
            )}
            <div className={`flex flex-row space-x-5 mt-5 overflow-auto scrollbar-hide transition-all duration-300 ${showResults ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0'}`}>
              { search_results && search_results.slice(0, 13).map((result: any, index: any) => (
                <div
                  className="bg-blue-100/50 dark:bg-muted border flex flex-row rounded-2xl p-4 text-xs sm:text-base w-[200px] flex-none"
                  key={index}
                >
                  <div className='space-y-1 overflow-hidden'>
                    <a href={result.location} target="_blank" rel="noopener noreferrer" className='flex flex-row space-x-0'>
                      <Image src={result && result.source === 'pagerduty' ? '/PagerDuty.png' : result && result.source ? `/${result.source}.svg` : '/default.png'} alt={result.title} className="mr-4 size-[20px]" width={10} height={10} />
                      <h3 className="text-sm mb-2 truncate font-semibold text-blue-800 group-hover:underline dark:text-blue-400">
                        {result.source.charAt(0).toUpperCase() + result.source.slice(1)}
                      </h3>
                    </a>
                    <p className="font-regular line-clamp-1 text-sm" dangerouslySetInnerHTML={{ __html: result.content }}></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Results Component
const Results = ({ results, isLoadingResults }) => (
  <>
    {isLoadingResults ? (
      <SearchResultsSkeleton />
    ) : (
      <div className="w-3/5 max-w-5xl items-start justify-start">
        {
          results ? 
          results.map((result: any, index: any) => (
            <div key={index}>
              <div
                key={index}
                className="group mb-4 flex max-w-4xl px-3 py-4 text-xs sm:text-base"
              >
                <Image src={result && result.documentMetadata.source === 'pagerduty' ? '/PagerDuty.png' : result && result.documentMetadata.source ? `/${result.documentMetadata.source}.svg` : '/default.png'} alt={result.documentMetadata.title} className="mr-4 size-[40px]" width={10} height={10} />
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div className='space-y-1'>
                    <a href={result.documentMetadata.link} target="_blank" rel="noopener noreferrer">
                      <h3 className="text-l mb-2 truncate font-semibold text-blue-800 group-hover:underline dark:text-blue-400">
                        {result.documentMetadata.title.charAt(0).toUpperCase() + result.documentMetadata.title.slice(1)}
                      </h3>
                    </a>
                    <p className="font-regular line-clamp-3 text-sm max-w-3xl" dangerouslySetInnerHTML={{ __html: result.snippets.map(snippet => snippet.content).join(" ... ") }}></p>
                    <div className='flex flex-row gap-2'>
                      <p className="font-regular line-clamp-3 text-sm text-gray-500">
                      {
                        !isNaN(new Date(result.documentMetadata.updated_at).getTime()) ?
                        new Date(result.documentMetadata.updated_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                        : null
                      }
                      </p>
                      <span className="font-regular text-sm text-gray-500">·</span>
                      <p className="font-regular line-clamp-3 text-sm text-gray-500">
                        {result.documentMetadata.type.charAt(0).toUpperCase() + result.documentMetadata.type.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
          : <p>No results found</p>
        }
      </div>
    )}
  </>
);

// Results Filter Component
const ResultsFilter = ({ results, isLoadingResults }) => (
  <div className="flex w-2/5 flex-col items-end">
    <div className="flex flex-col">
      {
        results ? 
          <AppFilterOptions results={results.searchInformation?.formattedTotalResults} />
        : <SearchByAppFilterSkeleton />
      }
    </div>
  </div>
);

// Main Component
export default function SearchResults({ search_results, ai_content, isLoadingResults, isLoadingCopilot }) {
  return (
    <div className="font-open-sans dark:bg-background flex min-h-screen flex-col dark:text-white items-center justify-start" >
      {/* <div className='sm:pl-[5%] md:pl-[14%] lg:pl-52' style={{background: 'linear-gradient(to bottom, rgba(0, 0, 255, 0.015) 1%, transparent)'}}>
        <AIResults content={ai_content} search_results={search_results} isLoadingCopilot={isLoadingCopilot}/>
      </div> */}
      <div className='flex flex-row items-center justify-center'>
        <div className='flex flex-row justify-center mt-5'>
          <Results results={search_results} isLoadingResults={isLoadingResults} />
          <ResultsFilter results={search_results} isLoadingResults={isLoadingResults} />
        </div>
      </div>
    </div>
  );
}