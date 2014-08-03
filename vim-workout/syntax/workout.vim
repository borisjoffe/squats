" Vim syntax file
" Language: Workout file
" Maintainer: Boris Joffe
" Latest Revision: 30 July 2014

if exists("b:current_syntax")
  finish
endif

" Keywords
setlocal iskeyword+=/
setlocal iskeyword+=+
syn keyword commentElementKeyword SETUP NOTATION INSIGHT TODO NEXT FOCUS nextgroup=syntaxElement2
syn keyword exerciseElementKeyword squat fsquat bench press rows snatch nextgroup=syntaxElement2
syn keyword exerciseElementKeyword dead/l c+j c+pj nextgroup=syntaxElement2

" Matches
syn match date '\d\{4}\/\d\{2}\/\d\{2}'
syn match sets '\d\+x\w\+'
syn match weight ':\(\d\+\w\+\)'
syn match comment '(.\+)'
"syn match sets 'regexp' contains=syntaxElement1 nextgroup=syntaxElement2 skipwhite

" Regions
syn region commentRegion start='(' end=')' contains=commentElementKeyword
syn region workoutRegion start='\n\t' end='\n\n' transparent contains=sets,weight,comment,exerciseElementKeyword,commentRegion


let b:current_syntax = "workout"

"hi def link comment                Comment
hi def link commentRegion           Comment
hi def link sets                    Label
hi def link weight                  Constant
hi def link exerciseElementKeyword  Identifier
hi def link commentElementKeyword   Label
hi def link date                    Special
