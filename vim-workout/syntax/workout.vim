" Vim syntax file
" Language: Workout file
" Maintainer: Boris Joffe
" Latest Revision: 17 June 2015

if exists("b:current_syntax")
  finish
endif

" Keywords
setlocal iskeyword+=/
setlocal iskeyword+=+
syn keyword commentElementKeyword SETUP NOTATION INSIGHT TODO NEXT N FOCUS TECHNIQUE WORKON INJURY LOOKUP NOTE nextgroup=syntaxElement2
" Powerlifting (and assistance)
syn keyword exerciseElementKeyword squat bench dead/l sumodl press rows goodm dead/c nextgroup=syntaxElement2
" Olympic Weightlifting and main assistance
syn keyword exerciseElementKeyword snatch c+j c+pj pc+pcj clean fsquat pjerk jerk  nextgroup=syntaxElement2
" Olympic Weightlifting assistance
syn keyword exerciseElementKeyword snpull hsnpull hpsn hhpsn vhpsn hhsn vhsn hsnatch psnatch pdsn dsnatch osquat sots hpclean pulls hpull hcpull ppress nextgroup=syntaxElement2

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
