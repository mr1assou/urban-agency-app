
export const departments={
    'service informatique':['admin']
    ,'département des études':['chef département','utilisateur']
    ,'département gestion urbaine':['chef département','utilisateur']
    ,'département affaires juridique et financières':['chef département','utilisateur']
    ,'département administratif et financier':['chef département','responsable de stock','utilisateur']
};



export const perms={
    admin:['gérer les comptes','demander un composant','état de mes demandes'],
    utilisateur:['demander un composant','état de mes demandes'],'chef département':['demander un composant','rapport département','regarder les demandes de département','état de mes demandes'],'responsable de stock':['ajouter des articles','valider les demandes','demander un composant','état de mes demandes','ajouter un nouveau stock','génerer le rapport pour le stock']
};

