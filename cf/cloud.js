//Set Up Moralis API Rate Limits Here
Moralis.settings.setAPIRateLimit({
  anonymous: 600000,
  authenticated: 600000,
  windowMs: 600000,
});
