/* eslint-disable no-param-reassign,no-empty */
import React from 'react';
import _ from 'lodash';
import embedjs from 'embedjs';
import sanitizeHtml from 'sanitize-html';
import Remarkable from 'remarkable';
import emojione from 'emojione';
import { jsonParse } from '../helpers/formatter';
import sanitizeConfig from '../helpers/SanitizeConfig';
import { replaceAll, imageRegex } from '../helpers/regexHelpers';
import htmlReady from '../helpers/steemitHtmlReady';

const remarkable = new Remarkable({
  html: true, // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: false, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’'
});

export function getHtml(body, jsonMetadata = {}) {
  const embeds = embedjs.getAll(body);
  const jsonMetadata = jsonParse(props.jsonMetadata);
  jsonMetadata.image = jsonMetadata.image || [];

  body = body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

  body.replace(imageRegex, (img) => {
    if (_.filter(jsonMetadata.image, i => i.indexOf(img) !== -1).length === 0) {
      jsonMetadata.image.push(img);
    }
  });

  body = remarkable.render(body);
  body = htmlReady(body).html;

  if (_.has(embeds, '[0].embed')) {
    embeds.forEach((embed) => {
      body = replaceAll(body, `<a href="${embed.url}">${embed.url}</a>`, embed.embed);

      if (body.search(`<[^>]+=([\\s"'])?${embed.url}(["'])?`) === -1) {
        body = replaceAll(body, embed.url, embed.embed);
      }
    });
  }

  body = sanitizeHtml(body, sanitizeConfig({}));
  return emojione.shortnameToImage(body);
}

export default (props) => {
  const bodyWithEmojis = getHtml(props.body, props.jsonMetadata);
  return <div dangerouslySetInnerHTML={{ __html: bodyWithEmojis }} />;
};
