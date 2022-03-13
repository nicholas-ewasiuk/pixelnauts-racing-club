/* eslint-disable no-use-before-define */

export async function okToFailAsync(callback: any, args: any[], wantObject = false) {
  try {
    // mandatory await here, can't just pass down (coz we need to catch error in this scope)
    return await callback(...args);
  } catch (e) {
    console.log(`Oh no! ${callback.name} called with ${args} blew up!`);
    console.log('Full error:', e);
    return wantObject ? {} : undefined;
  }
}

export function okToFailSync(callback: any, args: any[], wantObject = false) {
  try {
    return callback(...args);
  } catch (e) {
    console.log(`Oh no! ${callback.name} called with ${args} blew up!`);
    console.log('Full error:', e);
    return wantObject ? {} : undefined;
  }
}
