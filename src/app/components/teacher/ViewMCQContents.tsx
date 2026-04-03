import React from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../ui/accordion';
import { MCQQuestion } from './UploadMCQ';

export default function ViewMCQContents({
	rawquestions,
}: {
	rawquestions: any[];
}) {
	const questions = JSON.parse(rawquestions[0]) as MCQQuestion[];
	return (
		<Accordion type='single' collapsible className='w-fit'>
			<AccordionItem value='item-1'>
				<AccordionTrigger>View Questions</AccordionTrigger>
				<AccordionContent>
					{questions.map((question, index) => (
						<div key={index} className='line-clamp-1 space-x-3 space-y-1'>
							<span>{index + 1}.</span> <span>{question.question}</span>
							<span className='underline'>{question.correct}</span>
						</div>
					))}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
