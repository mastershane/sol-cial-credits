import { smoothArray } from "./smooth-data";
import { textCosineSimilarity } from "./cosine-similarity";
import { robDataArray } from "./rob-thomas-data";

export interface MatchResult {
	responseText: string;
	isMatch: boolean;
}

export interface IMatchBot {
	match: (text: string) => MatchResult
}

export class TriggerWordsBot implements IMatchBot {
	public match(text: string) {
		const normalizedText = text.toLowerCase();
		if(normalizedText.includes('play smooth') || normalizedText.includes('!smooth')){
			return {isMatch: true, responseText: 'https://youtu.be/6Whgn_iE5uc'};
		}
		if(normalizedText.includes('rob thomas')|| normalizedText.includes('robert thomas')|| normalizedText.includes('robot thomas')){
			const index = Math.floor(Math.random() * robDataArray.length);
			return {isMatch: true, responseText: robDataArray[index]};
		}
		if(normalizedText.includes('santana')){
			return {isMatch: true, responseText: 'https://youtu.be/h4Mrp6wuSwk'};
		}
		return {isMatch: false, responseText: ''};
	}
}

// tslint:disable-next-line: max-classes-per-file
export class SmoothBot implements IMatchBot {
	public match(text: string) {
		// removing the !gif keyword
		const cleanText = text.replace(/!gif/ig, '').trim();
		const bestMatch = smoothArray.map((smooth) => ({
			line: smooth,
			match: textCosineSimilarity(cleanText, smooth)
		})).sort((a, b) => b.match - a.match)[0]

		if(bestMatch.match > .95){
			let nextLineIndex = smoothArray.indexOf(bestMatch.line) + 1;
			if(nextLineIndex >= smoothArray.length){
				nextLineIndex = 0;
			}
			return {isMatch: true, responseText: smoothArray[nextLineIndex]}
		}

		if(bestMatch.match > .66){
			return {
				isMatch: true,
				responseText: "Did you mean to sing the lyric '" + bestMatch.line +	"' from the Grammy winning hit song Smooth by Santana f. Rob Thomas?"
			}
		}

		return {isMatch: false, responseText: ''};
	}
}



