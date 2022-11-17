import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useFormik } from 'formik';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { CursoService } from '../../service/cadastros/CursoService';
import { InputMask } from 'primereact/inputmask';


const Curso = () => {

    let objetoNovo = {
        nome: '',
        periodicidadeAvaliativa: 0,
        media: 0.0,
    };

    const [objetos, setObjetos] = useState(null);
    const [cidades, setCidades] = useState(null);
    const [permissoes, setPermissoes] = useState(null);
    const [objetoDialog, setObjetoDialog] = useState(false);
    const [objetoDeleteDialog, setObjetoDeleteDialog] = useState(false);
    const [objeto, setObjeto] = useState(objetoNovo);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const objetoService = new CursoService();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: objeto,
        validate: (data) => {
            let errors = {};

            if (!data.nome) {
                errors.nome = 'Nome é obrigatório';
            }

            if (!data.periodicidadeAvaliativa) {
                errors.periodicidadeAvaliativa = 'Periodicidade avaliativa é obrigatório';
            }

            if (!data.media) {
                errors.media = 'Média é obrigatória';
            }

            return errors;
        },
        onSubmit: (data) => {
            setObjeto(data);
            saveObjeto();
            formik.resetForm();
        }
    });

    useEffect(() => {
        if (objetos == null) {
            objetoService.listarTodos().then(res => {
                setObjetos(res.data)

            });
        }
    }, [objetos]);

    const openNew = () => {
        setObjeto(objetoNovo);
        setSubmitted(false);
        setObjetoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setObjetoDialog(false);
    }

    const hideDeleteObjetoDialog = () => {
        setObjetoDeleteDialog(false);
    }



    const saveObjeto = () => {
        setSubmitted(true);

        if (objeto.nome.trim()) {
            let _objeto = formik.values;
            if (objeto.id) {
                objetoService.alterar(_objeto).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Alterado com Sucesso', life: 3000 });
                    setObjetos(null);
                });
            }
            else {
                objetoService.inserir(_objeto).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Inserido com Sucesso', life: 3000 });
                    setObjetos(null);
                });

            }
            setObjetoDialog(false);
            setObjeto(objetoNovo);
        }
    }

    const editObjeto = (objeto) => {
        setObjeto({ ...objeto });
        setObjetoDialog(true);
    }

    const confirmDeleteObjeto = (objeto) => {
        setObjeto(objeto);
        setObjetoDeleteDialog(true);
    }

    const deleteObjeto = () => {

        objetoService.excluir(objeto.id).then(data => {
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Removido', life: 3000 });

            setObjetos(null);
            setObjetoDeleteDialog(false);

        });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _objeto = { ...objeto };
        _objeto[`${name}`] = val;

        setObjeto(_objeto);
    }

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo Curso" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />

                </div>
            </React.Fragment>
        )
    }

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    }

    const nomeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    }

    const periodicidadeAvaliativaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">PeriodicidadeAvaliativa</span>
                {rowData.periodicidadeAvaliativa}
            </>
        );
    }

    const mediaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Media</span>
                {rowData.media}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editObjeto(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteObjeto(rowData)} />
            </div>
        );
    }


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Registros Cadastrados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const objetoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button type="submit" form="formularioCurso" label="Salvar" icon="pi pi-check" className="p-button-text" />
        </>
    );

    const deleteObjetoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteObjetoDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteObjeto} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={objetos}
                               dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords}"
                               globalFilter={globalFilter} emptyMessage="Sem objetos cadastrados." header={header} responsiveLayout="scroll">
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="periodicidadeAvaliativa" header="Periodicidade Avaliativa" sortable body={periodicidadeAvaliativaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="media" header="Média" sortable body={mediaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={objetoDialog} style={{ width: '450px' }} header="Cadastrar/Editar" modal className="p-fluid" footer={objetoDialogFooter} onHide={hideDialog}>
                        <form id="formularioCurso" onSubmit={formik.handleSubmit}>
                            <div className="field">
                                <label htmlFor="nome">Nome*</label>
                                <InputText id="nome" value={formik.values.nome} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('nome') })} />
                                {getFormErrorMessage('nome')}
                            </div>

                            <div className="field">
                                <label htmlFor="periodicidadeAvaliativa">Periodicidade Avaliativa*</label>
                                <InputText id="periodicidadeAvaliativa" value={formik.values.periodicidadeAvaliativa} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('periodicidadeAvaliativa') })} />
                                {getFormErrorMessage('periodicidadeAvaliativa')}
                            </div>

                            <div className="field">
                                <label htmlFor="media">Média*</label>
                                <InputText id="media" value={formik.values.media} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('media') })} />
                                {getFormErrorMessage('media')}
                            </div>

                        </form>
                    </Dialog>

                    <Dialog visible={objetoDeleteDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteObjetoDialogFooter} onHide={hideDeleteObjetoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {objeto && <span>Deseja Excluir?</span>}
                        </div>
                    </Dialog>


                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Curso, comparisonFn);
