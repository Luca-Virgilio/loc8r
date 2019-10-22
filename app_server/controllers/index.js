
const homePageController = (req, res) => {
    res.render('index', {title:'Express'});
};

/* GET HomePage */
router.get('/', homePageController);