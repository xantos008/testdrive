import en from './en'
import ru from './ru'

export function fetchMock(lang) {
    return new Promise(resolve => resolve(data[lang]))
}

const data = {
	'ru': ru,
	'en': en
}