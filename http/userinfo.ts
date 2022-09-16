import conf from 'conf';

export const userLogin = (username: string, password: string) => {
  return fetch(`${conf.cmsApi}/api/auth/local`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // identifier 参数可以是电子邮件或用户名。
    body: JSON.stringify({ identifier: username, password }),
  }).then((res) => res.json());
};
