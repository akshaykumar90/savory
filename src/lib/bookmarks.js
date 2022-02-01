export async function fetchBookmarks({
  site,
  tags,
  search,
  cursor,
  itemsPerPage,
}) {
  let resp

  const commonArgs = {
    ...(site && { site }),
    ...(tags.length && { tags }),
    ...(cursor && { cursor }),
    num: itemsPerPage,
  }
  if (search !== '') {
    const args = {
      ...commonArgs,
      query: search,
    }
    resp = await ApiClient.searchBookmarks(args)
  } else {
    resp = await ApiClient.getBookmarks(commonArgs)
  }

  return resp.data
}
