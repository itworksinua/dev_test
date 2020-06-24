import { IMPPlayerItem } from 'react-native-mediapeers'

export interface ICastMember {
  name: string;
}

export interface ICrewMember {
  name: string;
  role: string;
}

export interface IPreviewImage {
  id: number;
  url: string;
  signingKey: string;
  distributionUrl: string;
  signing_key: string;
  distribution_url: string;
}

export interface ISlimLayer {
  year_of_production?: number;
  duration?: number;
}

export interface IFullLayer extends ISlimLayer {
  synopsis?: string;
  long_synopsis?: string;
  web_page?: string;
  category_ids?: number[];
  country?: string;
  casts?: ICastMember[];
  crews?: ICrewMember[];
}

export interface ISlimProduct {
  id: number;
  title: string;
  display_title: string;
  episodes_count?: number;
  seasons_count?: number;
  preview_image?: IPreviewImage;
  // eslint-disable-next-line
  type?: 'format' | 'series' | 'season' | 'episode' | 'program' | 'film_version'
}

export interface IFullProduct extends ISlimProduct {
  parent_id?: number;
  sequence_number?: number;
  ancestry?: string;

  // additional properties added via JS
  implicit_video_ids?: number[];
  ancestor_ids?: number[];
  stringified?: string;
}

export interface IAsset {
  id: number;
  name: string;
  classification: string;
  updated_at?: string;
  duration?: number;
  preview_image?: IPreviewImage;
  url?: string;

  // additional properties added via JS
  product_id?: number;
  product_ids?: number[];
  estimatedSize?: number;
  group_ids?: number[];

  // eslint-disable-next-line
  type?: 'video' | 'other'

  item?: IMPPlayerItem;
}

export interface IGroup {
  id: number;
  name: string;

  // additional properties added via JS
  product_ids?: number[];
}
