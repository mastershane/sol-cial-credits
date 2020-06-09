import { smoothArray } from "./smooth-data";
import { textCosineSimilarity } from "./cosine-similarity";

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
			return {isMatch: true, responseText: 'https://youtu.be/6Whgn_iE5uc'}
		}
		if(normalizedText.includes('rob thomas')){
			return {isMatch: true, responseText: 'https://en.wikipedia.org/wiki/Rob_Thomas_(musician)'}
		}
		if(normalizedText.includes('santana')){
			return {isMatch: true, responseText: 'https://youtu.be/h4Mrp6wuSwk'}
		}
		return {isMatch: false, responseText: ''};
	}
}

// tslint:disable-next-line: max-classes-per-file
export class SmoothBot implements IMatchBot {
	public match(text: string) {
		const bestMatch = smoothArray.map((smooth) => ({
			line: smooth,
			match: textCosineSimilarity(text, smooth)
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
				responseText: "Did you mean to sing the lyric '" + bestMatch.line +	"' from the hit song Smooth by Santana f. Rob Thomas?"// + Math.round(bestMatch.match * 100) + '% match'
			}
		}

		return {isMatch: false, responseText: ''};
	}
}



