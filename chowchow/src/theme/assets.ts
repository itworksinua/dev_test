// custom assets for each affiliations

const logos = {
  'fremantle.mediapeers' : require(`../../assets/images/fremantle/logo-fremantle-white.png`),
  'mpx.mediapeers' : require(`../../assets/images/logo-mediastore-white.png`),
}

export const getLogoByDomain = (domain) => {

  if (typeof domain !== `string`) return null

  const key = domain.replace(/https:\/\/|\.biz|\.us|\.mobi/g,``)

  return logos[key]
}

export default logos
