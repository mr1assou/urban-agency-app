
export const departments={
    'service informatique':['admin']
    ,'département des études':['chef département','utilisateur']
    ,'département gestion urbaine':['chef département','utilisateur']
    ,'département affaires juridique et financières':['chef département','utilisateur']
    ,'département administratif et financier':['chef département','responsable de stock','utilisateur']
};



export const perms={
    admin:['gérer les comptes','demander un composant'],
    utilisateur:['demander un composant'],'chef département':['demander un composant','rapport département','regarder les demandes'],'responsable de stock':['ajouter des articles']
};

