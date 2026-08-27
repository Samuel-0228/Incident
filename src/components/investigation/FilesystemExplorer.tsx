import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { VirtualFile } from '../../types/investigation';
import { Folder, File, HardDrive, Lock, Key, ChevronRight, FileText } from 'lucide-react';

export const FilesystemExplorer: React.FC = () => {
  const { filesystem, selectedFile, setSelectedFile } = useInvestigation();
  const [currentDir, setCurrentDir] = useState<string>('/Users/finance01/');

  // Extract directory structure
  const currentDirFiles = filesystem.filter((item) => {
    if (item.path === currentDir) return false;
    const parentPath = item.path.substring(0, item.path.lastIndexOf('/', item.path.length - 2) + 1);
    return item.path.startsWith(currentDir) && parentPath === currentDir;
  });

  const handleItemClick = (item: VirtualFile) => {
    if (item.type === 'dir') {
      setCurrentDir(item.path);
    } else {
      setSelectedFile(item);
    }
  };

  const pathParts = currentDir.split('/').filter(Boolean);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full text-xs font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242424] pb-4 gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wider uppercase font-sans flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-white inline" />
            <span>INTERACTIVE FILESYSTEM FORENSICS</span>
          </h1>
          <p className="text-[#777777] text-xs mt-0.5">
            Mounted target volume: WORKSTATION FINANCE-02 (C:\ Volume)
          </p>
        </div>

        {/* Breadcrumb path */}
        <div className="flex items-center space-x-1 bg-[#141414] px-3 py-1.5 rounded border border-[#242424] text-white">
          <button
            onClick={() => setCurrentDir('/Users/finance01/')}
            className="hover:underline text-[#777777] hover:text-white"
          >
            root
          </button>
          {pathParts.map((part, i) => (
            <React.Fragment key={i}>
              <ChevronRight className="w-3 h-3 text-[#777777]" />
              <button
                onClick={() => {
                  const newPath = '/' + pathParts.slice(0, i + 1).join('/') + '/';
                  setCurrentDir(newPath);
                }}
                className="hover:underline font-semibold"
              >
                {part}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Filesystem Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* File Directory Listing */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#242424] p-4 rounded space-y-3">
          <div className="flex justify-between items-center border-b border-[#242424] pb-2 text-[10px] text-[#777777] uppercase font-semibold">
            <span>NAME</span>
            <div className="flex space-x-8">
              <span>TYPE</span>
              <span>SIZE</span>
              <span>DATE MODIFIED</span>
            </div>
          </div>

          {/* Up one directory if not at root */}
          {currentDir !== '/' && (
            <div
              onClick={() => {
                const parts = currentDir.split('/').filter(Boolean);
                parts.pop();
                setCurrentDir(parts.length > 0 ? '/' + parts.join('/') + '/' : '/Users/finance01/');
              }}
              className="flex items-center space-x-2 p-2 rounded hover:bg-[#1A1A1A] cursor-pointer text-[#777777] hover:text-white transition-colors"
            >
              <Folder className="w-4 h-4 text-[#777777]" />
              <span>.. (Parent Directory)</span>
            </div>
          )}

          {currentDirFiles.map((file) => {
            const isDir = file.type === 'dir';
            const isSelected = selectedFile?.path === file.path;

            return (
              <div
                key={file.path}
                onClick={() => handleItemClick(file)}
                className={`flex items-center justify-between p-2.5 rounded border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E1E1E] border-white text-white font-bold'
                    : 'bg-[#101010] hover:bg-[#1A1A1A] border-[#242424] text-[#A0A0A0]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {isDir ? (
                    <Folder className="w-4 h-4 text-white" />
                  ) : (
                    <File className={`w-4 h-4 ${file.isClue ? 'text-amber-400' : 'text-[#777777]'}`} />
                  )}
                  <span className="font-semibold">{file.name}</span>
                  {file.isEncrypted && (
                    <Lock className="w-3 h-3 text-red-400 inline ml-1" />
                  )}
                  {file.isClue && (
                    <span className="text-[9px] bg-[#1C150C] border border-[#451A03] text-amber-400 px-1.5 py-0.2 rounded font-semibold">
                      CLUE ARTIFACT
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-8 text-[11px] text-[#777777]">
                  <span className="w-12">{isDir ? 'Folder' : 'File'}</span>
                  <span className="w-16 text-right">{file.size || '--'}</span>
                  <span className="w-28 text-right">{file.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* File Inspector Panel */}
        <div className="bg-[#141414] border border-[#242424] p-4 rounded space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-white tracking-wider uppercase font-sans border-b border-[#242424] pb-2 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#777777]" />
              <span>FILE CONTENT & METADATA</span>
            </h2>

            {selectedFile ? (
              <div className="space-y-3">
                <div>
                  <span className="text-[#777777] block text-[10px]">FILE OBJECT</span>
                  <span className="text-white font-bold text-sm">{selectedFile.name}</span>
                </div>

                <div>
                  <span className="text-[#777777] block text-[10px]">ABSOLUTE PATH</span>
                  <span className="text-[#A0A0A0] font-mono-tech text-[11px] break-all">
                    {selectedFile.path}
                  </span>
                </div>

                {selectedFile.isEncrypted && (
                  <div className="bg-[#1C0D0D] border border-[#450A0A] p-2.5 rounded text-red-400 space-y-1">
                    <div className="flex items-center space-x-1 font-bold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>ENCRYPTED ARCHIVE DETECTED</span>
                    </div>
                    <p className="text-[10px] text-[#A0A0A0]">
                      Encrypted staging file exfiltrated by threat actor.
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-[#777777] block text-[10px] mb-1">INSPECTED CONTENT</span>
                  <div className="bg-[#080808] p-3 rounded border border-[#242424] font-mono-tech text-[11px] text-[#F5F5F5] whitespace-pre-wrap min-h-[160px] max-h-[260px] overflow-y-auto">
                    {selectedFile.content || 'Binary data or empty file stream.'}
                  </div>
                </div>

                {selectedFile.flag && (
                  <div className="bg-[#1C150C] border border-[#451A03] p-3 rounded text-amber-400 space-y-1">
                    <span className="text-[10px] font-bold block uppercase tracking-wider">
                      RECOVERED CTF FLAG:
                    </span>
                    <code className="text-white font-mono-tech text-xs bg-[#080808] px-2 py-1 rounded border border-[#451A03] block select-all">
                      {selectedFile.flag}
                    </code>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[#777777] py-12 text-center">
                Select a file from the directory tree to inspect its contents.
              </div>
            )}
          </div>

          <div className="text-[10px] text-[#777777] border-t border-[#242424] pt-2">
            File contents are rendered safely in read-only sandbox mode.
          </div>
        </div>
      </div>
    </div>
  );
};
